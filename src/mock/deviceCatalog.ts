import { DeviceCategory } from '../types';

export interface DeviceSpecOption {
  model: string;
  storageOptions: string[];
  colors: string[];
  baseMSRP: number;
}

export interface BrandCatalog {
  brand: string;
  models: DeviceSpecOption[];
}

export const DEVICE_CATALOG: Record<DeviceCategory, BrandCatalog[]> = {
  smartphone: [
    {
      brand: 'Apple',
      models: [
        {
          model: 'iPhone 16 Pro Max',
          storageOptions: ['256 GB', '512 GB', '1 TB'],
          colors: ['Desert Titanium', 'Natural Titanium', 'White Titanium', 'Black Titanium'],
          baseMSRP: 119900
        },
        {
          model: 'iPhone 16',
          storageOptions: ['128 GB', '256 GB', '512 GB'],
          colors: ['Ultramarine', 'Teal', 'Pink', 'White', 'Black'],
          baseMSRP: 79900
        },
        {
          model: 'iPhone 15 Pro Max',
          storageOptions: ['256 GB', '512 GB', '1 TB'],
          colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
          baseMSRP: 119900
        },
        {
          model: 'iPhone 15 Pro',
          storageOptions: ['128 GB', '256 GB', '512 GB', '1 TB'],
          colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
          baseMSRP: 99900
        },
        {
          model: 'iPhone 15',
          storageOptions: ['128 GB', '256 GB', '512 GB'],
          colors: ['Pink', 'Yellow', 'Green', 'Blue', 'Black'],
          baseMSRP: 79900
        },
        {
          model: 'iPhone 14 Pro Max',
          storageOptions: ['128 GB', '256 GB', '512 GB', '1 TB'],
          colors: ['Deep Purple', 'Space Black', 'Silver', 'Gold'],
          baseMSRP: 109900
        },
        {
          model: 'iPhone 14 Pro',
          storageOptions: ['128 GB', '256 GB', '512 GB', '1 TB'],
          colors: ['Deep Purple', 'Space Black', 'Silver', 'Gold'],
          baseMSRP: 99900
        },
        {
          model: 'iPhone 14',
          storageOptions: ['128 GB', '256 GB', '512 GB'],
          colors: ['Blue', 'Purple', 'Yellow', 'Midnight', 'Starlight', 'Product Red'],
          baseMSRP: 69900
        },
        {
          model: 'iPhone 13 Pro',
          storageOptions: ['128 GB', '256 GB', '512 GB', '1 TB'],
          colors: ['Sierra Blue', 'Graphite', 'Silver', 'Alpine Green', 'Gold'],
          baseMSRP: 99900
        },
        {
          model: 'iPhone 13',
          storageOptions: ['128 GB', '256 GB', '512 GB'],
          colors: ['Midnight', 'Starlight', 'Blue', 'Pink', 'Red', 'Green'],
          baseMSRP: 69900
        },
        {
          model: 'iPhone 12',
          storageOptions: ['64 GB', '128 GB', '256 GB'],
          colors: ['Pacific Blue', 'Black', 'White', 'Green', 'Purple'],
          baseMSRP: 50900
        },
        {
          model: 'iPhone 11',
          storageOptions: ['64 GB', '128 GB'],
          colors: ['Black', 'White', 'Purple', 'Green', 'Yellow', 'Red'],
          baseMSRP: 41900
        },
        {
          model: 'iPhone SE (3rd Gen)',
          storageOptions: ['64 GB', '128 GB', '256 GB'],
          colors: ['Midnight', 'Starlight', 'Product Red'],
          baseMSRP: 35900
        }
      ]
    },
    {
      brand: 'Samsung',
      models: [
        {
          model: 'Galaxy S24 Ultra',
          storageOptions: ['256 GB', '512 GB', '1 TB'],
          colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow'],
          baseMSRP: 129900
        },
        {
          model: 'Galaxy S24+',
          storageOptions: ['256 GB', '512 GB'],
          colors: ['Onyx Black', 'Marble Gray', 'Cobalt Violet', 'Amber Yellow'],
          baseMSRP: 99900
        },
        {
          model: 'Galaxy S24',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Onyx Black', 'Marble Gray', 'Cobalt Violet', 'Amber Yellow'],
          baseMSRP: 79900
        },
        {
          model: 'Galaxy S23 Ultra',
          storageOptions: ['256 GB', '512 GB', '1 TB'],
          colors: ['Phantom Black', 'Cream', 'Green', 'Lavender'],
          baseMSRP: 119900
        },
        {
          model: 'Galaxy S23',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Phantom Black', 'Cream', 'Green', 'Lavender'],
          baseMSRP: 79900
        },
        {
          model: 'Galaxy Z Fold 5',
          storageOptions: ['256 GB', '512 GB', '1 TB'],
          colors: ['Icy Blue', 'Phantom Black', 'Cream'],
          baseMSRP: 170900
        },
        {
          model: 'Galaxy Z Flip 5',
          storageOptions: ['256 GB', '512 GB'],
          colors: ['Mint', 'Graphite', 'Cream', 'Lavender'],
          baseMSRP: 99900
        },
        {
          model: 'Galaxy S22 Ultra',
          storageOptions: ['128 GB', '256 GB', '512 GB'],
          colors: ['Burgundy', 'Phantom Black', 'Green', 'Phantom White'],
          baseMSRP: 99900
        },
        {
          model: 'Galaxy A54 5G',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Awesome Lime', 'Awesome Violet', 'Awesome Graphite', 'Awesome White'],
          baseMSRP: 37900
        },
        {
          model: 'Galaxy A34 5G',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Awesome Lime', 'Awesome Silver', 'Awesome Violet', 'Awesome Graphite'],
          baseMSRP: 29900
        }
      ]
    },
    {
      brand: 'Google',
      models: [
        {
          model: 'Pixel 9 Pro XL',
          storageOptions: ['128 GB', '256 GB', '512 GB', '1 TB'],
          colors: ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'],
          baseMSRP: 109900
        },
        {
          model: 'Pixel 9',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Obsidian', 'Porcelain', 'Wintergreen', 'Peony'],
          baseMSRP: 79900
        },
        {
          model: 'Pixel 8 Pro',
          storageOptions: ['128 GB', '256 GB', '512 GB'],
          colors: ['Bay Blue', 'Porcelain', 'Obsidian Black', 'Mint'],
          baseMSRP: 99900
        },
        {
          model: 'Pixel 8',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Rose', 'Hazel', 'Obsidian'],
          baseMSRP: 69900
        },
        {
          model: 'Pixel 7a',
          storageOptions: ['128 GB'],
          colors: ['Sea', 'Charcoal', 'Snow', 'Coral'],
          baseMSRP: 41900
        },
        {
          model: 'Pixel 6 Pro',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Stormy Black', 'Cloudy White', 'Sorta Sunny'],
          baseMSRP: 50900
        }
      ]
    },
    {
      brand: 'OnePlus',
      models: [
        {
          model: 'OnePlus 12',
          storageOptions: ['256 GB / 12GB RAM', '512 GB / 16GB RAM'],
          colors: ['Flowy Emerald', 'Silky Black'],
          baseMSRP: 79900
        },
        {
          model: 'OnePlus 12R',
          storageOptions: ['128 GB / 8GB RAM', '256 GB / 16GB RAM'],
          colors: ['Cool Blue', 'Iron Gray'],
          baseMSRP: 41900
        },
        {
          model: 'OnePlus Open (Foldable)',
          storageOptions: ['512 GB / 16GB RAM'],
          colors: ['Emerald Dusk', 'Voyager Black'],
          baseMSRP: 160900
        },
        {
          model: 'OnePlus 11',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Titan Black', 'Eternal Green'],
          baseMSRP: 69900
        },
        {
          model: 'OnePlus 10 Pro',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Volcanic Black', 'Emerald Forest'],
          baseMSRP: 50900
        },
        {
          model: 'OnePlus Nord 5',
          storageOptions: ['128 GB / 8GB RAM', '256 GB / 12GB RAM', '512 GB / 16GB RAM'],
          colors: ['Mercurial Silver', 'Phantom Black', 'Oasis Green'],
          baseMSRP: 32900
        },
        {
          model: 'OnePlus Nord 2T',
          storageOptions: ['128 GB / 8GB RAM', '256 GB / 12GB RAM'],
          colors: ['Gray Shadow', 'Jade Fog'],
          baseMSRP: 28900
        },
        {
          model: 'OnePlus Nord CE 4',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Celadon Marble', 'Dark Chrome'],
          baseMSRP: 23900
        }
      ]
    },
    {
      brand: 'Xiaomi / Redmi / POCO',
      models: [
        {
          model: 'Xiaomi 14 Ultra',
          storageOptions: ['512 GB / 16GB RAM'],
          colors: ['Black Vegan Leather', 'White Vegan Leather'],
          baseMSRP: 129900
        },
        {
          model: 'Xiaomi 13 Pro',
          storageOptions: ['256 GB', '512 GB'],
          colors: ['Ceramic Black', 'Ceramic Flora Green', 'Ceramic White'],
          baseMSRP: 89900
        },
        {
          model: 'Redmi Note 13 Pro+',
          storageOptions: ['256 GB', '512 GB'],
          colors: ['Fusion Purple', 'Fusion Black', 'Fusion White'],
          baseMSRP: 33900
        },
        {
          model: 'POCO F5 Pro',
          storageOptions: ['256 GB', '512 GB'],
          colors: ['Carbon Black', 'Pure White'],
          baseMSRP: 37900
        }
      ]
    },
    {
      brand: 'Nothing',
      models: [
        {
          model: 'Nothing Phone (2)',
          storageOptions: ['128 GB', '256 GB', '512 GB'],
          colors: ['Dark Gray (Glyph)', 'White (Glyph)'],
          baseMSRP: 50900
        },
        {
          model: 'Nothing Phone (2a)',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Black', 'White', 'Milk', 'Special Edition Blue'],
          baseMSRP: 29900
        }
      ]
    },
    {
      brand: 'Other / Custom Smartphone',
      models: [
        {
          model: 'Custom Smartphone Model',
          storageOptions: ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'],
          colors: ['Black', 'Silver', 'Blue', 'White', 'Gold', 'Other'],
          baseMSRP: 41900
        }
      ]
    }
  ],
  laptop: [
    {
      brand: 'Apple',
      models: [
        {
          model: 'MacBook Pro 16" M3 Max',
          storageOptions: ['1 TB SSD / 36GB RAM', '2 TB SSD / 48GB RAM', '4 TB SSD / 64GB RAM'],
          colors: ['Space Black', 'Silver'],
          baseMSRP: 236900
        },
        {
          model: 'MacBook Pro 14" M3 Pro',
          storageOptions: ['512 GB SSD / 18GB RAM', '1 TB SSD / 18GB RAM', '1 TB SSD / 36GB RAM'],
          colors: ['Space Black', 'Silver'],
          baseMSRP: 189900
        },
        {
          model: 'MacBook Pro 14" M1 Pro',
          storageOptions: ['512 GB SSD / 16GB RAM', '1 TB SSD / 16GB RAM'],
          colors: ['Space Gray', 'Silver'],
          baseMSRP: 151900
        },
        {
          model: 'MacBook Air 15" M2',
          storageOptions: ['256 GB SSD / 8GB RAM', '512 GB SSD / 16GB RAM'],
          colors: ['Midnight', 'Starlight', 'Space Gray', 'Silver'],
          baseMSRP: 129900
        },
        {
          model: 'MacBook Air 13" M2',
          storageOptions: ['256 GB SSD / 8GB RAM', '512 GB SSD / 16GB RAM'],
          colors: ['Midnight', 'Starlight', 'Space Gray', 'Silver'],
          baseMSRP: 109900
        },
        {
          model: 'MacBook Air 13" M1',
          storageOptions: ['256 GB SSD / 8GB RAM', '512 GB SSD / 16GB RAM'],
          colors: ['Gold', 'Space Gray', 'Silver'],
          baseMSRP: 89900
        }
      ]
    },
    {
      brand: 'Dell',
      models: [
        {
          model: 'XPS 15 9530 (OLED 3.5K)',
          storageOptions: ['1 TB SSD / 32GB RAM', '512 GB SSD / 16GB RAM'],
          colors: ['Platinum Silver with Black Carbon Fiber', 'Frost White'],
          baseMSRP: 179900
        },
        {
          model: 'XPS 13 Plus',
          storageOptions: ['512 GB SSD / 16GB RAM', '1 TB SSD / 32GB RAM'],
          colors: ['Platinum', 'Graphite'],
          baseMSRP: 139900
        },
        {
          model: 'Alienware m16 R2 Gaming',
          storageOptions: ['1 TB SSD / 32GB RAM', '2 TB SSD / 64GB RAM'],
          colors: ['Dark Metallic Moon'],
          baseMSRP: 170900
        },
        {
          model: 'Inspiron 16 Plus',
          storageOptions: ['512 GB SSD / 16GB RAM', '1 TB SSD / 16GB RAM'],
          colors: ['Dark Green', 'Platinum Silver'],
          baseMSRP: 99900
        },
        {
          model: 'Latitude 5440 Enterprise',
          storageOptions: ['512 GB SSD / 16GB RAM'],
          colors: ['Titan Gray'],
          baseMSRP: 119900
        }
      ]
    },
    {
      brand: 'Lenovo',
      models: [
        {
          model: 'ThinkPad X1 Carbon Gen 11',
          storageOptions: ['512 GB SSD / 16GB RAM', '1 TB SSD / 32GB RAM'],
          colors: ['Deep Black (Carbon Weave)'],
          baseMSRP: 151900
        },
        {
          model: 'ThinkPad T14 Gen 4',
          storageOptions: ['512 GB SSD / 16GB RAM', '1 TB SSD / 32GB RAM'],
          colors: ['Thunder Black', 'Storm Grey'],
          baseMSRP: 119900
        },
        {
          model: 'Legion Pro 7i Gaming',
          storageOptions: ['1 TB SSD / 32GB RAM', '2 TB SSD / 32GB RAM'],
          colors: ['Onyx Grey'],
          baseMSRP: 198900
        },
        {
          model: 'IdeaPad Slim 5',
          storageOptions: ['512 GB SSD / 16GB RAM'],
          colors: ['Cloud Grey', 'Abyss Blue'],
          baseMSRP: 69900
        }
      ]
    },
    {
      brand: 'Asus',
      models: [
        {
          model: 'ROG Zephyrus G14',
          storageOptions: ['1 TB SSD / 16GB RAM', '1 TB SSD / 32GB RAM'],
          colors: ['Eclipse Gray', 'Moonlight White'],
          baseMSRP: 151900
        },
        {
          model: 'Zenbook 14 OLED',
          storageOptions: ['512 GB SSD / 16GB RAM', '1 TB SSD / 16GB RAM'],
          colors: ['Ponder Blue', 'Foggy Silver'],
          baseMSRP: 99900
        },
        {
          model: 'TUF Gaming F15',
          storageOptions: ['512 GB SSD / 16GB RAM', '1 TB SSD / 16GB RAM'],
          colors: ['Mecha Gray', 'Jaeger Gray'],
          baseMSRP: 89900
        },
        {
          model: 'ROG Strix SCAR 16',
          storageOptions: ['1 TB SSD / 32GB RAM', '2 TB SSD / 32GB RAM'],
          colors: ['Off Black'],
          baseMSRP: 236900
        }
      ]
    },
    {
      brand: 'HP',
      models: [
        {
          model: 'HP OmniBook X Flip 14 Ultra 5',
          storageOptions: ['512 GB PCIe Gen4 SSD / 16GB LPDDR5X', '1 TB PCIe Gen4 SSD / 16GB LPDDR5X', '1 TB PCIe Gen4 SSD / 32GB LPDDR5X'],
          colors: ['Atmospheric Blue', 'Eclipse Gray', 'Glacier Silver'],
          baseMSRP: 129900
        },
        {
          model: 'Spectre x360 14 (2-in-1)',
          storageOptions: ['512 GB SSD / 16GB RAM', '1 TB SSD / 32GB RAM'],
          colors: ['Nightfall Black', 'Slate Blue'],
          baseMSRP: 149900
        },
        {
          model: 'OMEN 16 Gaming',
          storageOptions: ['1 TB SSD / 16GB RAM'],
          colors: ['Shadow Black'],
          baseMSRP: 139900
        },
        {
          model: 'Pavilion Plus 14',
          storageOptions: ['512 GB SSD / 16GB RAM'],
          colors: ['Natural Silver', 'Tranquil Pink'],
          baseMSRP: 74900
        }
      ]
    },
    {
      brand: 'Other / Custom Laptop',
      models: [
        {
          model: 'Custom Laptop / Notebook',
          storageOptions: ['256 GB SSD', '512 GB SSD', '1 TB SSD', '2 TB SSD'],
          colors: ['Silver', 'Black', 'Gray', 'White', 'Other'],
          baseMSRP: 80000
        }
      ]
    }
  ],
  tablet: [
    {
      brand: 'Apple',
      models: [
        {
          model: 'iPad Pro 13" (M4 OLED)',
          storageOptions: ['256 GB', '512 GB', '1 TB', '2 TB'],
          colors: ['Space Black', 'Silver'],
          baseMSRP: 129900
        },
        {
          model: 'iPad Pro 12.9" (6th Gen M2)',
          storageOptions: ['128 GB', '256 GB', '512 GB', '1 TB'],
          colors: ['Space Gray', 'Silver'],
          baseMSRP: 109900
        },
        {
          model: 'iPad Air 13" (M2)',
          storageOptions: ['128 GB', '256 GB', '512 GB'],
          colors: ['Space Gray', 'Blue', 'Purple', 'Starlight'],
          baseMSRP: 79900
        },
        {
          model: 'iPad Air (5th Gen M1)',
          storageOptions: ['64 GB', '256 GB'],
          colors: ['Blue', 'Purple', 'Space Gray', 'Starlight', 'Pink'],
          baseMSRP: 50900
        },
        {
          model: 'iPad (10th Gen)',
          storageOptions: ['64 GB', '256 GB'],
          colors: ['Yellow', 'Blue', 'Pink', 'Silver'],
          baseMSRP: 37900
        },
        {
          model: 'iPad mini (6th Gen)',
          storageOptions: ['64 GB', '256 GB'],
          colors: ['Space Gray', 'Pink', 'Purple', 'Starlight'],
          baseMSRP: 41900
        }
      ]
    },
    {
      brand: 'Samsung',
      models: [
        {
          model: 'Galaxy Tab S9 Ultra',
          storageOptions: ['256 GB', '512 GB', '1 TB'],
          colors: ['Graphite', 'Beige'],
          baseMSRP: 119900
        },
        {
          model: 'Galaxy Tab S9+',
          storageOptions: ['256 GB', '512 GB'],
          colors: ['Graphite', 'Beige'],
          baseMSRP: 99900
        },
        {
          model: 'Galaxy Tab S8+',
          storageOptions: ['128 GB', '256 GB'],
          colors: ['Graphite', 'Silver', 'Pink Gold'],
          baseMSRP: 89900
        },
        {
          model: 'Galaxy Tab A9+',
          storageOptions: ['64 GB', '128 GB'],
          colors: ['Graphite', 'Silver', 'Navy'],
          baseMSRP: 17400
        }
      ]
    },
    {
      brand: 'Microsoft',
      models: [
        {
          model: 'Surface Pro 9',
          storageOptions: ['128 GB SSD', '256 GB SSD', '512 GB SSD', '1 TB SSD'],
          colors: ['Platinum', 'Sapphire', 'Forest', 'Graphite'],
          baseMSRP: 99900
        }
      ]
    },
    {
      brand: 'Other / Custom Tablet',
      models: [
        {
          model: 'Custom Tablet Model',
          storageOptions: ['64 GB', '128 GB', '256 GB', '512 GB'],
          colors: ['Black', 'Silver', 'Gray', 'Other'],
          baseMSRP: 33900
        }
      ]
    }
  ],
  smartwatch: [
    {
      brand: 'Apple',
      models: [
        {
          model: 'Apple Watch Ultra 2 (49mm)',
          storageOptions: ['64 GB GPS+Cellular'],
          colors: ['Natural Titanium (Orange Ocean)', 'Natural Titanium (Trail Loop)', 'Black Titanium'],
          baseMSRP: 79900
        },
        {
          model: 'Apple Watch Ultra 1 (49mm)',
          storageOptions: ['32 GB GPS+Cellular'],
          colors: ['Natural Titanium (Alpine Loop)', 'Natural Titanium (Ocean)'],
          baseMSRP: 69900
        },
        {
          model: 'Apple Watch Series 9 (45mm)',
          storageOptions: ['64 GB GPS', '64 GB GPS+Cellular'],
          colors: ['Midnight', 'Starlight', 'Product Red', 'Silver Aluminum', 'Pink'],
          baseMSRP: 35900
        },
        {
          model: 'Apple Watch Series 8 (45mm)',
          storageOptions: ['32 GB GPS', '32 GB GPS+Cellular'],
          colors: ['Midnight', 'Starlight', 'Silver', 'Product Red'],
          baseMSRP: 29900
        },
        {
          model: 'Apple Watch SE (2nd Gen)',
          storageOptions: ['32 GB GPS'],
          colors: ['Midnight', 'Starlight', 'Silver'],
          baseMSRP: 19900
        }
      ]
    },
    {
      brand: 'Samsung',
      models: [
        {
          model: 'Galaxy Watch 6 Classic (47mm)',
          storageOptions: ['16 GB Bluetooth', '16 GB LTE'],
          colors: ['Black Stainless', 'Silver Stainless'],
          baseMSRP: 33900
        },
        {
          model: 'Galaxy Watch 6 (44mm)',
          storageOptions: ['16 GB Bluetooth'],
          colors: ['Graphite', 'Silver'],
          baseMSRP: 23900
        },
        {
          model: 'Galaxy Watch 5 Pro (45mm)',
          storageOptions: ['16 GB Titanium'],
          colors: ['Black Titanium', 'Gray Titanium'],
          baseMSRP: 29900
        }
      ]
    },
    {
      brand: 'Garmin',
      models: [
        {
          model: 'Fenix 7 Pro Sapphire Solar',
          storageOptions: ['32 GB Multi-Band GPS'],
          colors: ['Carbon Gray Titanium', 'Titanium with Fog Gray'],
          baseMSRP: 89900
        },
        {
          model: 'Forerunner 965 AMOLED',
          storageOptions: ['32 GB Music & Maps'],
          colors: ['Black Titanium', 'Amp Yellow', 'White Titanium'],
          baseMSRP: 50900
        }
      ]
    },
    {
      brand: 'Other / Custom Smartwatch',
      models: [
        {
          model: 'Custom Smartwatch Model',
          storageOptions: ['Standard Memory'],
          colors: ['Black', 'Silver', 'Gold', 'Rose Gold', 'Other'],
          baseMSRP: 19900
        }
      ]
    }
  ],
  gaming: [
    {
      brand: 'Sony',
      models: [
        {
          model: 'PlayStation 5 Slim Disc Edition',
          storageOptions: ['1 TB NVMe SSD'],
          colors: ['Original White', 'Midnight Black Plates', 'Volcanic Red Plates', 'Cobalt Blue Plates'],
          baseMSRP: 41900
        },
        {
          model: 'PlayStation 5 Digital Edition',
          storageOptions: ['1 TB NVMe SSD'],
          colors: ['Original White', 'Midnight Black Plates'],
          baseMSRP: 37900
        },
        {
          model: 'PlayStation 4 Pro (1TB)',
          storageOptions: ['1 TB HDD / Upgraded SSD'],
          colors: ['Jet Black', 'Glacier White'],
          baseMSRP: 23900
        },
        {
          model: 'PlayStation Portal Remote Player',
          storageOptions: ['Direct Remote Play'],
          colors: ['Classic DualSense White'],
          baseMSRP: 15900
        }
      ]
    },
    {
      brand: 'Microsoft',
      models: [
        {
          model: 'Xbox Series X (1 TB)',
          storageOptions: ['1 TB SSD', '2 TB Galaxy Black Edition'],
          colors: ['Carbon Black', 'Galaxy Black Special Edition'],
          baseMSRP: 41900
        },
        {
          model: 'Xbox Series S (512 GB / 1 TB)',
          storageOptions: ['512 GB SSD', '1 TB SSD'],
          colors: ['Robot White', 'Carbon Black'],
          baseMSRP: 23900
        }
      ]
    },
    {
      brand: 'Nintendo',
      models: [
        {
          model: 'Switch OLED Model',
          storageOptions: ['64 GB + microSD'],
          colors: ['White Joy-Con', 'Neon Blue & Red', 'Zelda Tears of the Kingdom Gold', 'Mario Red Edition'],
          baseMSRP: 29900
        },
        {
          model: 'Switch Standard (V2)',
          storageOptions: ['32 GB + microSD'],
          colors: ['Neon Blue & Red', 'Gray Joy-Con', 'Animal Crossing Pastel'],
          baseMSRP: 23900
        },
        {
          model: 'Switch Lite',
          storageOptions: ['32 GB + microSD'],
          colors: ['Turquoise', 'Yellow', 'Coral', 'Blue', 'Timmy & Tommy Edition'],
          baseMSRP: 15900
        }
      ]
    },
    {
      brand: 'Valve / Asus Handhelds',
      models: [
        {
          model: 'Steam Deck OLED (1 TB)',
          storageOptions: ['1 TB NVMe SSD + Antiglare Glass'],
          colors: ['Matte Black', 'Translucent Limited Edition'],
          baseMSRP: 64900
        },
        {
          model: 'Steam Deck LCD (512 GB)',
          storageOptions: ['512 GB NVMe SSD'],
          colors: ['Matte Black'],
          baseMSRP: 37900
        },
        {
          model: 'Asus ROG Ally Z1 Extreme',
          storageOptions: ['512 GB NVMe SSD / 16GB LPDDR5'],
          colors: ['Pure White with RGB Halos'],
          baseMSRP: 50900
        }
      ]
    },
    {
      brand: 'Other / Custom Gaming Device',
      models: [
        {
          model: 'Custom Console / Handheld',
          storageOptions: ['500 GB', '1 TB', '2 TB'],
          colors: ['Black', 'White', 'Custom Skin'],
          baseMSRP: 29900
        }
      ]
    }
  ],
  audio: [
    {
      brand: 'Sony',
      models: [
        {
          model: 'WH-1000XM5 Wireless Noise-Canceling',
          storageOptions: ['Standard ANC Bluetooth 5.2'],
          colors: ['Silver', 'Black', 'Midnight Blue', 'Smoky Pink'],
          baseMSRP: 33900
        },
        {
          model: 'WH-1000XM4 Wireless Noise-Canceling',
          storageOptions: ['Standard ANC'],
          colors: ['Black', 'Silver', 'Midnight Blue'],
          baseMSRP: 23900
        },
        {
          model: 'WF-1000XM5 True Wireless Earbuds',
          storageOptions: ['Wireless Charging Case'],
          colors: ['Black', 'Silver'],
          baseMSRP: 22400
        }
      ]
    },
    {
      brand: 'Apple',
      models: [
        {
          model: 'AirPods Max (USB-C)',
          storageOptions: ['USB-C Hi-Res Lossless Audio'],
          colors: ['Midnight', 'Starlight', 'Blue', 'Purple', 'Orange'],
          baseMSRP: 46900
        },
        {
          model: 'AirPods Max (Lightning)',
          storageOptions: ['Lightning ANC'],
          colors: ['Space Gray', 'Silver', 'Sky Blue', 'Pink', 'Green'],
          baseMSRP: 40900
        },
        {
          model: 'AirPods Pro 2 (USB-C MagSafe Case)',
          storageOptions: ['MagSafe USB-C Case (H2 Chip)'],
          colors: ['Gloss White'],
          baseMSRP: 19900
        },
        {
          model: 'AirPods (3rd Gen)',
          storageOptions: ['MagSafe Charging Case'],
          colors: ['Gloss White'],
          baseMSRP: 14400
        }
      ]
    },
    {
      brand: 'Bose',
      models: [
        {
          model: 'QuietComfort Ultra Headphones',
          storageOptions: ['Immersive Audio ANC'],
          colors: ['Black', 'White Smoke', 'Sandstone'],
          baseMSRP: 35900
        },
        {
          model: 'QuietComfort 45',
          storageOptions: ['TriPort Acoustic ANC'],
          colors: ['Triple Black', 'White Smoke'],
          baseMSRP: 22400
        }
      ]
    },
    {
      brand: 'JBL',
      models: [
        {
          model: 'JBL Tune Beam 2',
          storageOptions: ['Smart Ambient ANC (48H Battery)', '4-Mic Pure Bass Edition'],
          colors: ['Ghost Black', 'Ghost White', 'Midnight Blue', 'Purple'],
          baseMSRP: 6499
        }
      ]
    },
    {
      brand: 'Boult Audio',
      models: [
        {
          model: 'Boult Audio Que',
          storageOptions: ['32dB Active Noise Cancellation (40H Battery)', 'Zen Quad Mic ENC Ultra-Low Latency'],
          colors: ['Raven Black', 'Pine Green', 'Ivory White'],
          baseMSRP: 2299
        }
      ]
    },
    {
      brand: 'Other / Custom Audio Gear',
      models: [
        {
          model: 'Custom Audio Headphones / DAC',
          storageOptions: ['Standard HiFi'],
          colors: ['Black', 'Silver', 'Wood / Bronze', 'Other'],
          baseMSRP: 15900
        }
      ]
    }
  ]
};
