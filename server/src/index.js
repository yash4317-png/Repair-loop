import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initDatabase, getPool } from './db.js';
import { seedDatabase } from './seed.js';
import { loadBootstrap, mapInspection, mapOffer, mapPart, mapTechnician, publicUser } from './mappers.js';
import { calculateDeviceValuation, generateBestRecommendation, runReturnNetworkSimulation } from './logic.js';

const JWT_SECRET = process.env.JWT_SECRET || 'repairloop-dev-secret-change-me';
const PORT = Number(process.env.PORT || 4000);

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Sign in required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired' });
  }
}

function newId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

async function authPayload(db, userRow) {
  const bootstrap = await loadBootstrap(db);
  return { token: signToken(userRow), user: publicUser(userRow), bootstrap };
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '8mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    const db = await getPool();
    await db.query('SELECT 1');
    res.json({ ok: true, database: 'mysql', service: 'repairloop-api' });
  } catch (err) {
    res.status(503).json({ ok: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const db = await getPool();
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json(await authPayload(db, user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const safeRole = role === 'shopkeeper' ? 'shopkeeper' : 'customer';
    const db = await getPool();
    const [existing] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length) return res.status(409).json({ error: 'An account with that email already exists' });
    const initials = (name || email).slice(0, 2).toUpperCase();
    const user = {
      id: newId('user'),
      name: name || email.split('@')[0],
      email,
      password_hash: bcrypt.hashSync(password, 10),
      role: safeRole,
      shop_id: safeRole === 'shopkeeper' ? 'shop_apex' : null,
      phone: null,
      avatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2310b981"/><text x="50" y="62" fill="%23ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">${initials[0]}</text></svg>`
    };
    await db.query(
      `INSERT INTO users (id, name, email, password_hash, role, shop_id, phone, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, user.password_hash, user.role, user.shop_id, user.phone, user.avatar]
    );
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [user.id]);
    res.status(201).json(await authPayload(db, rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/demo', async (req, res) => {
  try {
    const { email, userId } = req.body || {};
    const db = await getPool();
    const [rows] = userId
      ? await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId])
      : await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (!rows[0]) return res.status(404).json({ error: 'Demo user not found' });
    res.json(await authPayload(db, rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authRequired, async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    if (!rows[0]) return res.status(401).json({ error: 'User no longer exists' });
    res.json(await authPayload(db, rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bootstrap', authRequired, async (_req, res) => {
  try {
    const db = await getPool();
    res.json(await loadBootstrap(db));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inspections', authRequired, async (req, res) => {
  try {
    const data = req.body || {};
    const db = await getPool();
    const id = newId('insp');
    const trackingNumber = `RPL-MUJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const submittedAt = new Date();
    const aiValuation = data.aiValuation || calculateDeviceValuation(data);
    await db.query(
      `INSERT INTO inspections (id, tracking_number, customer_id, customer_name, customer_email, category, brand, model, specs, age_months, purchase_year, condition_rating, damages, functional_checks, photos, notes, submitted_at, status, ai_valuation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, trackingNumber, data.customerId || req.user.id, data.customerName, data.customerEmail, data.category, data.brand, data.model, JSON.stringify(data.specs || {}), data.ageMonths, data.purchaseYear, data.conditionRating, JSON.stringify(data.damages || []), JSON.stringify(data.functionalChecks || {}), JSON.stringify(data.photos || []), data.notes || '', submittedAt, 'quotes_received', JSON.stringify(aiValuation)]
    );

    const [shopRows] = await db.query('SELECT * FROM shops WHERE id = ? LIMIT 1', ['shop_apex']);
    const shop = shopRows[0];
    let autoOffer = null;
    if (shop) {
      const offerId = newId('offer_auto');
      const proposedPrice = Math.round((aiValuation.depreciatedBaseValue || 0) * 0.38);
      await db.query(
        `INSERT INTO offers (id, inspection_id, shop_id, shop_name, shop_location, shop_rating, disposition, proposed_price, used_inventory_parts, total_parts_cost, estimated_labor_hours, labor_rate_per_hour, total_labor_cost, projected_profit, profit_margin_percent, turnaround_days, warranty_months, notes, created_at, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [offerId, id, shop.id, shop.name, shop.location, shop.rating, 'fix_and_return', proposedPrice, JSON.stringify([]), 70, 1.5, shop.labor_rate_per_hour, Math.round(1.5 * Number(shop.labor_rate_per_hour)), 45, 24.5, 1, 12, 'Immediate quote from MUJ Campus Plaza Depot.', submittedAt, 'pending']
      );
      const [offerRows] = await db.query('SELECT * FROM offers WHERE id = ?', [offerId]);
      autoOffer = mapOffer(offerRows[0]);
    }

    const [inspRows] = await db.query('SELECT * FROM inspections WHERE id = ?', [id]);
    res.status(201).json({ inspection: mapInspection(inspRows[0]), autoOffer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/offers', authRequired, async (req, res) => {
  try {
    const data = req.body || {};
    const db = await getPool();
    const id = newId('offer');
    const createdAt = new Date();
    await db.query(
      `INSERT INTO offers (id, inspection_id, shop_id, shop_name, shop_location, shop_rating, disposition, proposed_price, used_inventory_parts, total_parts_cost, estimated_labor_hours, labor_rate_per_hour, total_labor_cost, projected_profit, profit_margin_percent, turnaround_days, warranty_months, notes, created_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.inspectionId, data.shopId, data.shopName, data.shopLocation, data.shopRating, data.disposition, data.proposedPrice, JSON.stringify(data.usedInventoryParts || []), data.totalPartsCost, data.estimatedLaborHours, data.laborRatePerHour, data.totalLaborCost, data.projectedProfit, data.profitMarginPercent, data.turnaroundDays, data.warrantyMonths, data.notes || '', createdAt, 'pending']
    );
    await db.query(
      `UPDATE inspections SET status = CASE WHEN status = 'pending_review' THEN 'quotes_received' ELSE status END WHERE id = ?`,
      [data.inspectionId]
    );
    const [rows] = await db.query('SELECT * FROM offers WHERE id = ?', [id]);
    res.status(201).json({ offer: mapOffer(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/offers/:offerId/accept', authRequired, async (req, res) => {
  try {
    const { offerId } = req.params;
    const { inspectionId } = req.body || {};
    const db = await getPool();
    const [offerRows] = await db.query('SELECT * FROM offers WHERE id = ? LIMIT 1', [offerId]);
    if (!offerRows[0]) return res.status(404).json({ error: 'Offer not found' });
    const inspId = inspectionId || offerRows[0].inspection_id;
    await db.query(`UPDATE offers SET status = CASE WHEN id = ? THEN 'accepted' ELSE 'declined' END WHERE inspection_id = ?`, [offerId, inspId]);
    const [techRows] = await db.query('SELECT id FROM technicians WHERE shop_id = ? LIMIT 1', [offerRows[0].shop_id]);
    const techId = techRows[0]?.id || 'tech_1';
    await db.query('UPDATE inspections SET status = ?, accepted_offer_id = ?, assigned_technician_id = ? WHERE id = ?', ['accepted', offerId, techId, inspId]);
    res.json({ ok: true, assignedTechnicianId: techId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/quick-requests', authRequired, async (req, res) => {
  try {
    const data = req.body || {};
    const db = await getPool();
    const id = newId('quick');
    const trackingCode = `QUICK-MUJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date();
    await db.query(
      `INSERT INTO quick_requests (id, customer_id, customer_name, customer_email, category, brand, model, action, estimated_payout, pickup_address, pickup_time_slot, created_at, status, tracking_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.customerId || req.user.id, data.customerName, data.customerEmail, data.category, data.brand, data.model, data.action, data.estimatedPayout, data.pickupAddress, data.pickupTimeSlot, createdAt, 'scheduled', trackingCode]
    );
    const [rows] = await db.query('SELECT * FROM quick_requests WHERE id = ?', [id]);
    const row = rows[0];
    res.status(201).json({
      request: {
        id: row.id,
        customerId: row.customer_id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        category: row.category,
        brand: row.brand,
        model: row.model,
        action: row.action,
        estimatedPayout: Number(row.estimated_payout),
        pickupAddress: row.pickup_address,
        pickupTimeSlot: row.pickup_time_slot,
        createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
        status: row.status,
        trackingCode: row.tracking_code
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inspections/:id/assign-technician', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId, taskDescription } = req.body || {};
    const db = await getPool();
    await db.query('UPDATE inspections SET assigned_technician_id = ? WHERE id = ?', [technicianId, id]);
    const [inspRows] = await db.query('SELECT * FROM inspections WHERE id = ?', [id]);
    if (inspRows[0]) {
      await db.query(
        `UPDATE technicians SET bench_device_id = ?, bench_model = ?, bench_task = ?, bench_started_at = ?, bench_est_min = ? WHERE id = ?`,
        [inspRows[0].id, `${inspRows[0].brand} ${inspRows[0].model}`, taskDescription || 'Active diagnosis & component repair', 'Just now', 45, technicianId]
      );
    }
    const [techRows] = await db.query('SELECT * FROM technicians WHERE id = ?', [technicianId]);
    res.json({ technician: techRows[0] ? mapTechnician(techRows[0]) : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventory', authRequired, async (req, res) => {
  try {
    const data = req.body || {};
    const db = await getPool();
    const id = newId('part');
    const lastRestocked = new Date().toISOString().slice(0, 10);
    await db.query(
      `INSERT INTO inventory_parts (id, shop_id, sku, name, category, compatible_models, quantity_in_stock, min_threshold, unit_cost, retail_price, part_condition, last_restocked)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.shopId, data.sku, data.name, data.category, JSON.stringify(data.compatibleModels || []), data.quantityInStock, data.minThreshold, data.unitCost, data.retailPrice, data.condition, lastRestocked]
    );
    const [rows] = await db.query('SELECT * FROM inventory_parts WHERE id = ?', [id]);
    res.status(201).json({ part: mapPart(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/inventory/:id/stock', authRequired, async (req, res) => {
  try {
    const { quantityChange } = req.body || {};
    const db = await getPool();
    await db.query(
      'UPDATE inventory_parts SET quantity_in_stock = GREATEST(0, quantity_in_stock + ?) WHERE id = ?',
      [Number(quantityChange) || 0, req.params.id]
    );
    const [rows] = await db.query('SELECT * FROM inventory_parts WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Part not found' });
    res.json({ part: mapPart(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inspections/:id/recommendation', authRequired, async (req, res) => {
  try {
    const db = await getPool();
    const [inspRows] = await db.query('SELECT * FROM inspections WHERE id = ?', [req.params.id]);
    if (!inspRows[0]) return res.status(404).json({ error: 'Inspection not found' });
    const [offerRows] = await db.query('SELECT * FROM offers WHERE inspection_id = ?', [req.params.id]);
    res.json({ recommendation: generateBestRecommendation(mapInspection(inspRows[0]), offerRows.map(mapOffer)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/simulation', authRequired, async (_req, res) => {
  res.json(runReturnNetworkSimulation());
});

app.post('/api/demo/reset', authRequired, async (_req, res) => {
  try {
    await seedDatabase(true);
    const db = await getPool();
    const [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', ['user_cust_1']);
    res.json(await authPayload(db, rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

initDatabase()
  .then(async () => {
    await seedDatabase(false);
    app.listen(PORT, () => {
      console.log(`RepairLoop API listening on http://127.0.0.1:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start RepairLoop API', err);
    process.exit(1);
  });
