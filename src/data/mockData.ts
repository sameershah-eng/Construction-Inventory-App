import { Asset, InventoryItem, JobSite, MaintenanceTask, NotificationItem, User, ActivityLog } from '../types';

export const INITIAL_SITES: JobSite[] = [
  {
    id: 'site-1',
    name: 'Northgate Tower',
    code: 'NGT-01',
    address: '420 Pine Street, Metro Core',
    activeAssetCount: 6,
    openTasksCount: 4,
    mapCoords: { x: 38, y: 35 }
  },
  {
    id: 'site-2',
    name: 'Riverside Bridge Retrofit',
    code: 'RBR-02',
    address: 'Pier 14 South Causeway',
    activeAssetCount: 4,
    openTasksCount: 3,
    mapCoords: { x: 62, y: 58 }
  },
  {
    id: 'site-3',
    name: 'Eastfield Logistics Hub',
    code: 'ELH-03',
    address: '880 Airport Parkway Sec 4',
    activeAssetCount: 5,
    openTasksCount: 2,
    mapCoords: { x: 74, y: 25 }
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Marcus Vance',
    email: 'm.vance@toolyard.io',
    role: 'admin',
    title: 'Fleet & Equipment Director',
    initials: 'MV',
    assignedSiteId: 'site-1'
  },
  {
    id: 'user-2',
    name: 'Elena Rostova',
    email: 'e.rostova@toolyard.io',
    role: 'supervisor',
    title: 'Northgate Project Superintendent',
    initials: 'ER',
    assignedSiteId: 'site-1'
  },
  {
    id: 'user-3',
    name: 'Frank Delgado',
    email: 'f.delgado@toolyard.io',
    role: 'supervisor',
    title: 'Riverside Site Superintendent',
    initials: 'FD',
    assignedSiteId: 'site-2'
  },
  {
    id: 'user-4',
    name: 'Jimmy "Mac" Kovacs',
    email: 'j.kovacs@toolyard.io',
    role: 'mechanic',
    title: 'Lead Field Heavy Mechanic',
    initials: 'JK',
    assignedSiteId: 'site-1'
  },
  {
    id: 'user-5',
    name: 'Tyler Brooks',
    email: 't.brooks@toolyard.io',
    role: 'mechanic',
    title: 'Equipment Service Tech II',
    initials: 'TB',
    assignedSiteId: 'site-2'
  },
  {
    id: 'user-6',
    name: 'Samira Khan',
    email: 's.khan@toolyard.io',
    role: 'storekeeper',
    title: 'Lead Toolroom Controller',
    initials: 'SK',
    assignedSiteId: 'site-1'
  },
  {
    id: 'user-7',
    name: 'Dave Miller',
    email: 'd.miller@toolyard.io',
    role: 'storekeeper',
    title: 'Tool Crib Specialist',
    initials: 'DM',
    assignedSiteId: 'site-3'
  },
  {
    id: 'user-8',
    name: 'Chloe Nguyen',
    email: 'c.nguyen@toolyard.io',
    role: 'supervisor',
    title: 'Eastfield Field Operations Lead',
    initials: 'CN',
    assignedSiteId: 'site-3'
  }
];

// Curated high-res construction photos with fast CDN caching
export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Hilti TE 70-ATC Rotary Hammer',
    sku: 'HLT-TE70-982',
    category: 'equipment',
    quantity: 3,
    minQuantity: 2,
    unit: 'Units',
    binLocation: 'Rack A-02',
    siteId: 'site-1',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=70&auto=format',
    model: 'TE 70-ATC/AVR SDS-Max',
    notes: 'Heavy concrete coring and demolition. Greased weekly.'
  },
  {
    id: 'inv-2',
    name: 'DeWalt 20V MAX XR 1/2" Impact Wrench',
    sku: 'DWT-DCF899-10',
    category: 'equipment',
    quantity: 7,
    minQuantity: 3,
    unit: 'Units',
    binLocation: 'Rack A-05',
    siteId: 'site-1',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&q=70&auto=format',
    model: 'DCF899P2 High Torque',
    notes: 'High breakaway torque. Assigned with 5.0Ah battery pairs.'
  },
  {
    id: 'inv-3',
    name: 'Hilti 12mm Wedge Anchor Bolts (Box 50)',
    sku: 'ANC-KB3-12-100',
    category: 'consumables',
    quantity: 4,
    minQuantity: 10,
    unit: 'Boxes',
    binLocation: 'Bin C-14',
    siteId: 'site-1',
    status: 'low_stock',
    imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&q=70&auto=format',
    notes: 'Approved for structural seismic anchoring. Reorder triggered.'
  },
  {
    id: 'inv-4',
    name: '3M DBI-SALA ExoFit Full Body Harness',
    sku: 'SAF-3M-EXO-L',
    category: 'equipment',
    quantity: 12,
    minQuantity: 6,
    unit: 'Harnesses',
    binLocation: 'Locker S-01',
    siteId: 'site-1',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&q=70&auto=format',
    notes: 'Class A harness with quick-connect chest and leg buckles.'
  },
  {
    id: 'inv-5',
    name: 'Husqvarna 14" Diamond Concrete Blades',
    sku: 'BLD-HSQ-14-PRO',
    category: 'consumables',
    quantity: 2,
    minQuantity: 5,
    unit: 'Blades',
    binLocation: 'Bin C-09',
    siteId: 'site-1',
    status: 'low_stock',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=70&auto=format',
    notes: 'Laser welded segments. High speed cured concrete and rebar.'
  },
  {
    id: 'inv-6',
    name: 'Bosch GRL 900 Rotary Laser Level Kit',
    sku: 'OPT-BSH-900-LS',
    category: 'equipment',
    quantity: 1,
    minQuantity: 2,
    unit: 'Kits',
    binLocation: 'Cabinet B-01',
    siteId: 'site-1',
    status: 'checked_out',
    checkedOutTo: 'Elena Rostova',
    checkedOutDate: 'Today, 07:15 AM',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=70&auto=format',
    notes: 'Self-leveling horizontal & vertical rotary laser. Calibration cert valid.'
  },
  {
    id: 'inv-7',
    name: 'Milwaukee M18 FUEL Deep Cut Band Saw',
    sku: 'MLW-BSW-2729',
    category: 'equipment',
    quantity: 4,
    minQuantity: 2,
    unit: 'Units',
    binLocation: 'Rack B-03',
    siteId: 'site-2',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&q=70&auto=format',
    notes: '5" x 5" cutting capacity for structural steel cutting.'
  },
  {
    id: 'inv-8',
    name: 'Stihl TS 420 14" Gas Cutquik Saw',
    sku: 'STL-TS420-GAS',
    category: 'equipment',
    quantity: 2,
    minQuantity: 2,
    unit: 'Units',
    binLocation: 'Cage D-01',
    siteId: 'site-2',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=70&auto=format',
    notes: 'Requires 50:1 pre-mix two-stroke fuel. Clean air filter weekly.'
  },
  {
    id: 'inv-9',
    name: 'Greenlee 1/2" - 2" Hydraulic Conduit Bender',
    sku: 'HYD-GRN-881-CT',
    category: 'equipment',
    quantity: 1,
    minQuantity: 1,
    unit: 'Sets',
    binLocation: 'Heavy Tool Area',
    siteId: 'site-3',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=70&auto=format',
    notes: 'Bends EMT, IMC, and Rigid conduit up to 2 inches.'
  },
  {
    id: 'inv-10',
    name: 'Grade 70 Transport Chain 3/8" (20ft)',
    sku: 'RIG-CHN-G70-20',
    category: 'equipment',
    quantity: 8,
    minQuantity: 4,
    unit: 'Chains',
    binLocation: 'Rigging Rack',
    siteId: 'site-2',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&q=70&auto=format',
    notes: 'Working load limit 6,600 lbs with forged clevis grab hooks.'
  },
  {
    id: 'inv-11',
    name: 'Hydraulic Oil ISO VG 46 (5 Gallon Pail)',
    sku: 'OIL-ISO46-5GAL',
    category: 'consumables',
    quantity: 15,
    minQuantity: 8,
    unit: 'Pails',
    binLocation: 'Fluid Storage 02',
    siteId: 'site-1',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=70&auto=format',
    notes: 'Premium anti-wear fluid for excavators and hydraulic hammers.'
  },
  {
    id: 'inv-12',
    name: 'CAT 1R-0716 High Efficiency Fuel Filters',
    sku: 'CAT-FLT-1R0716',
    category: 'parts',
    quantity: 6,
    minQuantity: 4,
    unit: 'Filters',
    binLocation: 'Parts Bin P-08',
    siteId: 'site-1',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=70&auto=format',
    notes: 'Compatible with CAT 320 excavator and C7.1 engines.'
  },
  {
    id: 'inv-13',
    name: 'Miller Multimatic 220 AC/DC Welder',
    sku: 'MLR-WLD-MM220',
    category: 'equipment',
    quantity: 2,
    minQuantity: 2,
    unit: 'Units',
    binLocation: 'Weld Bay 1',
    siteId: 'site-2',
    status: 'checked_out',
    checkedOutTo: 'Frank Delgado',
    checkedOutDate: 'Yesterday, 04:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&q=70&auto=format',
    notes: 'Multi-process MIG, TIG, Stick with dual voltage plug.'
  },
  {
    id: 'inv-14',
    name: 'Heavy Duty 12/3 SJTW Extension Cord 100ft',
    sku: 'ELC-CRD-123-100',
    category: 'consumables',
    quantity: 18,
    minQuantity: 10,
    unit: 'Cords',
    binLocation: 'Rack E-04',
    siteId: 'site-3',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=70&auto=format',
    notes: 'Lighted indicator ends, weather resistant -40F to 140F.'
  },
  {
    id: 'inv-15',
    name: 'Enerpac 30-Ton Hollow Plunger Jack',
    sku: 'HYD-ENR-RCH302',
    category: 'equipment',
    quantity: 2,
    minQuantity: 1,
    unit: 'Cylinders',
    binLocation: 'Heavy Tool Area',
    siteId: 'site-2',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&q=70&auto=format',
    notes: 'Center hole design for tensioning rods and pulling pins.'
  },
  {
    id: 'inv-16',
    name: 'Wacker Neuson Trench Rammer Shoe 11"',
    sku: 'PRT-WCK-SHOE11',
    category: 'parts',
    quantity: 1,
    minQuantity: 3,
    unit: 'Shoes',
    binLocation: 'Parts Bin P-19',
    siteId: 'site-3',
    status: 'low_stock',
    imageUrl: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&q=70&auto=format',
    notes: 'Replacement laminated wood/steel shoe for BS 50-2 rammers.'
  },
  {
    id: 'inv-17',
    name: 'DeWalt 60V MAX 9" Cut-Off Saw',
    sku: 'DWT-DCS690-X2',
    category: 'equipment',
    quantity: 3,
    minQuantity: 2,
    unit: 'Units',
    binLocation: 'Rack A-08',
    siteId: 'site-1',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=70&auto=format',
    notes: 'Zero emissions for indoor concrete and masonry cutting.'
  },
  {
    id: 'inv-18',
    name: 'Lincoln Electric Fleetweld 5P+ 1/8" (50lb)',
    sku: 'CSM-LNC-5P-50',
    category: 'consumables',
    quantity: 6,
    minQuantity: 4,
    unit: 'Cans',
    binLocation: 'Weld Storage',
    siteId: 'site-2',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&q=70&auto=format',
    notes: 'AWS E6010 cellulosic electrode for pipe and cross-country welding.'
  },
  {
    id: 'inv-19',
    name: 'Fluke 87V Industrial Multimeter',
    sku: 'TST-FLK-87V-IND',
    category: 'equipment',
    quantity: 3,
    minQuantity: 2,
    unit: 'Units',
    binLocation: 'Cabinet B-04',
    siteId: 'site-3',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&q=70&auto=format',
    notes: 'True RMS digital multimeter with temperature probe.'
  },
  {
    id: 'inv-20',
    name: 'Ridgid 300 Complete Pipe Threading Machine',
    sku: 'PIP-RDG-300-SET',
    category: 'equipment',
    quantity: 1,
    minQuantity: 1,
    unit: 'Machines',
    binLocation: 'Bay 3 Station',
    siteId: 'site-1',
    status: 'checked_out',
    checkedOutTo: 'Marcus Vance',
    checkedOutDate: 'Oct 19, 09:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?w=600&q=70&auto=format',
    notes: 'Heavy duty pipe threader with 1206 stand and 418 oiler.'
  },
  {
    id: 'inv-21',
    name: 'MSA SoundControl Hearing Muff Helmet-Mount',
    sku: 'SAF-MSA-HPH-02',
    category: 'consumables',
    quantity: 24,
    minQuantity: 12,
    unit: 'Pairs',
    binLocation: 'Safety Locker 04',
    siteId: 'site-1',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&q=70&auto=format',
    notes: 'NRR 25dB slotted helmet clip-on earmuffs.'
  },
  {
    id: 'inv-22',
    name: 'Caterpillar 1R-0749 Secondary Fuel Filters',
    sku: 'CAT-FLT-1R0749',
    category: 'parts',
    quantity: 8,
    minQuantity: 5,
    unit: 'Filters',
    binLocation: 'Parts Bin P-09',
    siteId: 'site-1',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&q=70&auto=format',
    notes: 'For CAT wheel loaders and heavy excavator engines.'
  },
  {
    id: 'inv-23',
    name: 'Simpson Strong-Tie Epoxy Anchoring Adhesive (22oz)',
    sku: 'CSM-SMP-SET-3G',
    category: 'consumables',
    quantity: 3,
    minQuantity: 8,
    unit: 'Cartridges',
    binLocation: 'Chemical Cabinet 1',
    siteId: 'site-2',
    status: 'low_stock',
    imageUrl: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&q=70&auto=format',
    notes: 'SET-3G high strength epoxy anchoring adhesive. Expiry: 12/2027.'
  },
  {
    id: 'inv-24',
    name: 'Makita 18V LXT Cordless Rebar Tier',
    sku: 'MKT-RBR-DTR180',
    category: 'equipment',
    quantity: 2,
    minQuantity: 1,
    unit: 'Units',
    binLocation: 'Rack B-07',
    siteId: 'site-2',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&q=70&auto=format',
    notes: 'Ties up to #5 x #5 rebar in under 0.8 seconds.'
  },
  {
    id: 'inv-25',
    name: 'Tie Wire Spools 21-Gauge (Carton 50)',
    sku: 'CSM-TIE-21G-50',
    category: 'consumables',
    quantity: 12,
    minQuantity: 6,
    unit: 'Cartons',
    binLocation: 'Bin C-22',
    siteId: 'site-2',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&q=70&auto=format',
    notes: 'Black annealed tie wire coils for Makita rebar tier.'
  },
  {
    id: 'inv-26',
    name: 'Generac 10kW Portable Mobile Light Tower Mast Lamp',
    sku: 'PRT-LGT-1000W-MH',
    category: 'parts',
    quantity: 4,
    minQuantity: 2,
    unit: 'Bulbs',
    binLocation: 'Parts Bin P-14',
    siteId: 'site-3',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=70&auto=format',
    notes: '1000 Watt metal halide replacement fixtures.'
  },
  {
    id: 'inv-27',
    name: 'Knaack 4830 Jobmaster Steel Storage Chest',
    sku: 'STR-KNK-4830-ST',
    category: 'equipment',
    quantity: 5,
    minQuantity: 2,
    unit: 'Chests',
    binLocation: 'Site Yard A',
    siteId: 'site-3',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=70&auto=format',
    notes: '16-gauge steel with 3-point latch lock system.'
  },
  {
    id: 'inv-28',
    name: '3M N95 Particulate Respirator (Box 20)',
    sku: 'SAF-3M-8210-20',
    category: 'consumables',
    quantity: 35,
    minQuantity: 15,
    unit: 'Boxes',
    binLocation: 'Safety Locker 02',
    siteId: 'site-1',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&q=70&auto=format',
    notes: 'NIOSH approved 8210 particulate respirator for silica dust.'
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-1',
    name: 'Caterpillar 320 Hydraulic Excavator',
    model: 'CAT 320 GC Next Gen',
    serialNumber: 'CAT0320GC-99201',
    category: 'Earthmoving',
    siteId: 'site-1',
    status: 'overdue_inspection',
    engineHours: 3412,
    hoursHistory: [
      { month: 'Jun', hours: 2950 },
      { month: 'Jul', hours: 3080 },
      { month: 'Aug', hours: 3210 },
      { month: 'Sep', hours: 3320 },
      { month: 'Oct', hours: 3412 }
    ],
    lastInspection: '2026-07-15',
    nextInspection: '2026-10-15', // Overdue relative to current date (Oct 21, 2026)
    assignedOperator: 'Derrick Vance',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=70&auto=format',
    mapCoords: { x: 34, y: 40 },
    movementHistory: [
      {
        id: 'mv-1',
        date: '2026-08-10',
        from: 'Riverside Bridge Retrofit',
        to: 'Northgate Tower',
        loggedBy: 'Marcus Vance',
        reason: 'Foundation excavation phase 2 mobilization'
      },
      {
        id: 'mv-2',
        date: '2026-05-02',
        from: 'Central Equipment Depot',
        to: 'Riverside Bridge Retrofit',
        loggedBy: 'Frank Delgado',
        reason: 'Cofferdam retaining wall site prep'
      }
    ]
  },
  {
    id: 'ast-2',
    name: 'JLG 600S Telescopic Boom Lift',
    model: 'JLG 600S 4WD Diesel',
    serialNumber: 'JLG600S-841920',
    category: 'Access Equipment',
    siteId: 'site-1',
    status: 'in_use',
    engineHours: 1840,
    hoursHistory: [
      { month: 'Jun', hours: 1620 },
      { month: 'Jul', hours: 1690 },
      { month: 'Aug', hours: 1740 },
      { month: 'Sep', hours: 1795 },
      { month: 'Oct', hours: 1840 }
    ],
    lastInspection: '2026-09-02',
    nextInspection: '2026-11-02',
    assignedOperator: 'Carlos Gomez',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&q=70&auto=format',
    mapCoords: { x: 42, y: 32 },
    movementHistory: [
      {
        id: 'mv-3',
        date: '2026-09-01',
        from: 'Eastfield Logistics Hub',
        to: 'Northgate Tower',
        loggedBy: 'Elena Rostova',
        reason: 'Curtain wall glazing installation'
      }
    ]
  },
  {
    id: 'ast-3',
    name: 'Bobcat S650 Skid-Steer Loader',
    model: 'Bobcat S650 T4',
    serialNumber: 'BCT-S650-33019',
    category: 'Earthmoving',
    siteId: 'site-1',
    status: 'available',
    engineHours: 2190,
    hoursHistory: [
      { month: 'Jun', hours: 1980 },
      { month: 'Jul', hours: 2040 },
      { month: 'Aug', hours: 2100 },
      { month: 'Sep', hours: 2150 },
      { month: 'Oct', hours: 2190 }
    ],
    lastInspection: '2026-08-20',
    nextInspection: '2026-11-20',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&q=70&auto=format',
    mapCoords: { x: 36, y: 38 },
    movementHistory: [
      {
        id: 'mv-4',
        date: '2026-07-15',
        from: 'Central Yard',
        to: 'Northgate Tower',
        loggedBy: 'Samira Khan',
        reason: 'Sub-grade backfill and stone spreading'
      }
    ]
  },
  {
    id: 'ast-4',
    name: 'Honda EU7000is Inverter Generator',
    model: 'Honda EU7000is EFI',
    serialNumber: 'HND-EU7K-49021',
    category: 'Power & Generation',
    siteId: 'site-1',
    status: 'in_use',
    engineHours: 645,
    hoursHistory: [
      { month: 'Jun', hours: 410 },
      { month: 'Jul', hours: 490 },
      { month: 'Aug', hours: 550 },
      { month: 'Sep', hours: 605 },
      { month: 'Oct', hours: 645 }
    ],
    lastInspection: '2026-09-15',
    nextInspection: '2026-10-22', // Due tomorrow!
    assignedOperator: 'Jimmy Kovacs',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=70&auto=format',
    mapCoords: { x: 39, y: 36 },
    movementHistory: [
      {
        id: 'mv-5',
        date: '2026-08-01',
        from: 'Central Depot',
        to: 'Northgate Tower',
        loggedBy: 'Jimmy Kovacs',
        reason: 'Backup power for concrete curing heating blankets'
      }
    ]
  },
  {
    id: 'ast-5',
    name: 'Komatsu WA380-8 Wheel Loader',
    model: 'Komatsu WA380-8 Tier 4F',
    serialNumber: 'KMT-WA380-55102',
    category: 'Earthmoving',
    siteId: 'site-2',
    status: 'overdue_inspection',
    engineHours: 4890,
    hoursHistory: [
      { month: 'Jun', hours: 4400 },
      { month: 'Jul', hours: 4560 },
      { month: 'Aug', hours: 4690 },
      { month: 'Sep', hours: 4790 },
      { month: 'Oct', hours: 4890 }
    ],
    lastInspection: '2026-07-10',
    nextInspection: '2026-10-10', // Overdue!
    assignedOperator: 'Frank Delgado',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=70&auto=format',
    mapCoords: { x: 60, y: 56 },
    movementHistory: [
      {
        id: 'mv-6',
        date: '2026-06-18',
        from: 'Northgate Tower',
        to: 'Riverside Bridge Retrofit',
        loggedBy: 'Frank Delgado',
        reason: 'Rip-rap gravel handling along river embankment'
      }
    ]
  },
  {
    id: 'ast-6',
    name: 'Genie GS-1930 Scissor Lift',
    model: 'Genie GS-1930 Electric',
    serialNumber: 'GEN-GS19-11842',
    category: 'Access Equipment',
    siteId: 'site-2',
    status: 'available',
    engineHours: 580,
    hoursHistory: [
      { month: 'Jun', hours: 500 },
      { month: 'Jul', hours: 520 },
      { month: 'Aug', hours: 545 },
      { month: 'Sep', hours: 565 },
      { month: 'Oct', hours: 580 }
    ],
    lastInspection: '2026-09-12',
    nextInspection: '2026-12-12',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=70&auto=format',
    mapCoords: { x: 64, y: 60 },
    movementHistory: []
  },
  {
    id: 'ast-7',
    name: 'Wacker Neuson DPU 6555 Plate Compactor',
    model: 'DPU 6555H Reversible',
    serialNumber: 'WCK-DPU65-7801',
    category: 'Compaction',
    siteId: 'site-2',
    status: 'maintenance',
    engineHours: 1120,
    hoursHistory: [
      { month: 'Jun', hours: 980 },
      { month: 'Jul', hours: 1020 },
      { month: 'Aug', hours: 1060 },
      { month: 'Sep', hours: 1095 },
      { month: 'Oct', hours: 1120 }
    ],
    lastInspection: '2026-08-30',
    nextInspection: '2026-11-30',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&q=70&auto=format',
    mapCoords: { x: 61, y: 59 },
    movementHistory: []
  },
  {
    id: 'ast-8',
    name: 'Liebherr LTM 1100-4.2 All Terrain Crane',
    model: 'LTM 1100 Mobile 120T',
    serialNumber: 'LBH-1100-4091',
    category: 'Lifting & Rigging',
    siteId: 'site-2',
    status: 'in_use',
    engineHours: 5210,
    hoursHistory: [
      { month: 'Jun', hours: 4900 },
      { month: 'Jul', hours: 5010 },
      { month: 'Aug', hours: 5090 },
      { month: 'Sep', hours: 5160 },
      { month: 'Oct', hours: 5210 }
    ],
    lastInspection: '2026-09-28',
    nextInspection: '2026-10-28',
    assignedOperator: 'Viktor Orlov',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&q=70&auto=format',
    mapCoords: { x: 63, y: 57 },
    movementHistory: []
  },
  {
    id: 'ast-9',
    name: 'Doosan Portable Air Compressor 375 CFM',
    model: 'Doosan P375WCU-T4F',
    serialNumber: 'DSN-375-99410',
    category: 'Pneumatics',
    siteId: 'site-3',
    status: 'available',
    engineHours: 1940,
    hoursHistory: [
      { month: 'Jun', hours: 1720 },
      { month: 'Jul', hours: 1800 },
      { month: 'Aug', hours: 1860 },
      { month: 'Sep', hours: 1910 },
      { month: 'Oct', hours: 1940 }
    ],
    lastInspection: '2026-08-15',
    nextInspection: '2026-11-15',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&q=70&auto=format',
    mapCoords: { x: 72, y: 24 },
    movementHistory: []
  },
  {
    id: 'ast-10',
    name: 'Magnum MLT4060 Mobile Light Tower',
    model: 'Generac MLT4060-MH',
    serialNumber: 'MLT-4060-23491',
    category: 'Power & Lighting',
    siteId: 'site-3',
    status: 'in_use',
    engineHours: 3200,
    hoursHistory: [
      { month: 'Jun', hours: 2800 },
      { month: 'Jul', hours: 2950 },
      { month: 'Aug', hours: 3040 },
      { month: 'Sep', hours: 3120 },
      { month: 'Oct', hours: 3200 }
    ],
    lastInspection: '2026-09-05',
    nextInspection: '2026-11-05',
    assignedOperator: 'Dave Miller',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=70&auto=format',
    mapCoords: { x: 76, y: 26 },
    movementHistory: []
  },
  {
    id: 'ast-11',
    name: 'CAT 259D3 Compact Track Loader',
    model: 'Caterpillar 259D3 High Flow',
    serialNumber: 'CAT-259D3-88410',
    category: 'Earthmoving',
    siteId: 'site-3',
    status: 'available',
    engineHours: 1450,
    hoursHistory: [
      { month: 'Jun', hours: 1210 },
      { month: 'Jul', hours: 1290 },
      { month: 'Aug', hours: 1350 },
      { month: 'Sep', hours: 1400 },
      { month: 'Oct', hours: 1450 }
    ],
    lastInspection: '2026-09-18',
    nextInspection: '2026-12-18',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=70&auto=format',
    mapCoords: { x: 73, y: 27 },
    movementHistory: []
  },
  {
    id: 'ast-12',
    name: 'Atlas Copco HiLight V5+ LED Tower',
    model: 'Atlas Copco HiLight V5+',
    serialNumber: 'ATC-V5-11094',
    category: 'Power & Lighting',
    siteId: 'site-1',
    status: 'available',
    engineHours: 890,
    hoursHistory: [
      { month: 'Jun', hours: 750 },
      { month: 'Jul', hours: 790 },
      { month: 'Aug', hours: 830 },
      { month: 'Sep', hours: 865 },
      { month: 'Oct', hours: 890 }
    ],
    lastInspection: '2026-08-25',
    nextInspection: '2026-11-25',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=70&auto=format',
    mapCoords: { x: 37, y: 33 },
    movementHistory: []
  }
];

export const INITIAL_TASKS: MaintenanceTask[] = [
  {
    id: 'tsk-1',
    title: '500-Hour Hydraulic Fluid & Filter Service',
    assetId: 'ast-1',
    assetName: 'Caterpillar 320 Hydraulic Excavator',
    siteId: 'site-1',
    dueDate: '2026-10-18', // Overdue!
    isOverdue: true,
    priority: 'high',
    recurrence: 'every_250_hours',
    assignedMechanicId: 'user-4',
    assignedMechanicName: 'Jimmy "Mac" Kovacs',
    status: 'pending',
    notes: 'Drain hydraulic tank, replace pilot filter and main return filter. Inspect boom cylinders for weepage.'
  },
  {
    id: 'tsk-2',
    title: 'OSHA Annual Boom Structure & Cable Inspection',
    assetId: 'ast-2',
    assetName: 'JLG 600S Telescopic Boom Lift',
    siteId: 'site-1',
    dueDate: '2026-10-21', // Due today!
    isOverdue: false,
    priority: 'high',
    recurrence: 'monthly',
    assignedMechanicId: 'user-4',
    assignedMechanicName: 'Jimmy "Mac" Kovacs',
    status: 'pending',
    notes: 'Mandatory structural weld inspection, platform leveling cylinder check, and emergency descent test.'
  },
  {
    id: 'tsk-3',
    title: 'Replace Generator Spark Plug & Clean Carburetor',
    assetId: 'ast-4',
    assetName: 'Honda EU7000is Inverter Generator',
    siteId: 'site-1',
    dueDate: '2026-10-22', // Due tomorrow
    isOverdue: false,
    priority: 'medium',
    recurrence: 'every_30_days',
    assignedMechanicId: 'user-5',
    assignedMechanicName: 'Tyler Brooks',
    status: 'pending',
    notes: 'Replace BPR6ES spark plug, inspect fuel line, run load test at 5kW.'
  },
  {
    id: 'tsk-4',
    title: 'Loader Differential & Planetary Hub Oil Change',
    assetId: 'ast-5',
    assetName: 'Komatsu WA380-8 Wheel Loader',
    siteId: 'site-2',
    dueDate: '2026-10-14', // Overdue!
    isOverdue: true,
    priority: 'high',
    recurrence: 'every_250_hours',
    assignedMechanicId: 'user-5',
    assignedMechanicName: 'Tyler Brooks',
    status: 'pending',
    notes: 'Sample axle oil for iron particulate before draining. Torque drain plugs to 120 ft-lbs.'
  },
  {
    id: 'tsk-5',
    title: 'Exciter Bearing Lubrication & Drive Belt Tension',
    assetId: 'ast-7',
    assetName: 'Wacker Neuson Plate Compactor',
    siteId: 'site-2',
    dueDate: '2026-10-21', // Due today!
    isOverdue: false,
    priority: 'medium',
    recurrence: 'monthly',
    assignedMechanicId: 'user-5',
    assignedMechanicName: 'Tyler Brooks',
    status: 'in_progress',
    notes: 'Check centrifugal clutch engagement and grease exciter bearings with synthetic NLGI 2.'
  },
  {
    id: 'tsk-6',
    title: 'Bobcat 250-Hr Engine Oil & Secondary Air Filter',
    assetId: 'ast-3',
    assetName: 'Bobcat S650 Skid-Steer Loader',
    siteId: 'site-1',
    dueDate: '2026-10-24',
    isOverdue: false,
    priority: 'low',
    recurrence: 'every_250_hours',
    assignedMechanicId: 'user-4',
    assignedMechanicName: 'Jimmy "Mac" Kovacs',
    status: 'pending',
    notes: '15W-40 CJ-4 oil replacement. Blow out radiator cooling fins.'
  },
  {
    id: 'tsk-7',
    title: 'Monthly Crane Wire Rope & Hook Latch Audit',
    assetId: 'ast-8',
    assetName: 'Liebherr LTM 1100 All Terrain Crane',
    siteId: 'site-2',
    dueDate: '2026-10-25',
    isOverdue: false,
    priority: 'high',
    recurrence: 'monthly',
    assignedMechanicId: 'user-5',
    assignedMechanicName: 'Tyler Brooks',
    status: 'pending',
    notes: 'Check 21mm hoist rope for bird-caging or broken outer wires. Verify anti-two-block sensor.'
  },
  {
    id: 'tsk-8',
    title: 'Compressor Minimum Pressure Valve Rebuild',
    assetId: 'ast-9',
    assetName: 'Doosan Portable Air Compressor 375 CFM',
    siteId: 'site-3',
    dueDate: '2026-10-27',
    isOverdue: false,
    priority: 'medium',
    recurrence: 'none',
    assignedMechanicId: 'user-4',
    assignedMechanicName: 'Jimmy "Mac" Kovacs',
    status: 'pending',
    notes: 'Kit #35384400 replacement. Pressure drops below 90 PSI under cyclic air tool demand.'
  },
  {
    id: 'tsk-9',
    title: 'Mast Winch Cable & Guide Roller Inspection',
    assetId: 'ast-10',
    assetName: 'Magnum MLT4060 Mobile Light Tower',
    siteId: 'site-3',
    dueDate: '2026-10-12', // Overdue!
    isOverdue: true,
    priority: 'medium',
    recurrence: 'every_30_days',
    assignedMechanicId: 'user-4',
    assignedMechanicName: 'Jimmy "Mac" Kovacs',
    status: 'pending',
    notes: 'Check manual brake winch and galvanized cable for fraying.'
  },
  {
    id: 'tsk-10',
    title: 'Track Tension & Sprocket Wear Measurement',
    assetId: 'ast-11',
    assetName: 'CAT 259D3 Compact Track Loader',
    siteId: 'site-3',
    dueDate: '2026-10-29',
    isOverdue: false,
    priority: 'low',
    recurrence: 'every_30_days',
    assignedMechanicId: 'user-5',
    assignedMechanicName: 'Tyler Brooks',
    status: 'pending',
    notes: 'Measure track sag (1.5" spec) and inspect drive lugs for cracking.'
  },
  {
    id: 'tsk-11',
    title: 'Scissor Lift Pot-Hole Protection Interlock Test',
    assetId: 'ast-6',
    assetName: 'Genie GS-1930 Scissor Lift',
    siteId: 'site-2',
    dueDate: '2026-10-15',
    isOverdue: false,
    priority: 'medium',
    recurrence: 'monthly',
    assignedMechanicId: 'user-5',
    assignedMechanicName: 'Tyler Brooks',
    status: 'completed',
    completedDate: '2026-10-15',
    notes: 'Pothole plungers deploy smoothly. Limit switches confirmed operational.',
    partsUsed: ['Dielectric grease contact spray'],
    completionPhotos: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=70&auto=format']
  },
  {
    id: 'tsk-12',
    title: 'LED Array Driver Circuit Diagnostic',
    assetId: 'ast-12',
    assetName: 'Atlas Copco HiLight V5+ LED Tower',
    siteId: 'site-1',
    dueDate: '2026-10-16',
    isOverdue: false,
    priority: 'low',
    recurrence: 'none',
    assignedMechanicId: 'user-4',
    assignedMechanicName: 'Jimmy "Mac" Kovacs',
    status: 'completed',
    completedDate: '2026-10-16',
    notes: 'Replaced thermal fuse on ballast 2. Luminaire now at 100% output.',
    partsUsed: ['10A Thermal Fuse', 'Waterproof Heat Shrink'],
    completionPhotos: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=70&auto=format']
  },
  {
    id: 'tsk-13',
    title: 'Pre-Pour Vibrator Head Seal Rebuild',
    assetId: 'inv-1',
    assetName: 'Hilti TE 70-ATC Rotary Hammer',
    siteId: 'site-1',
    dueDate: '2026-10-10',
    isOverdue: false,
    priority: 'low',
    recurrence: 'none',
    assignedMechanicId: 'user-4',
    assignedMechanicName: 'Jimmy "Mac" Kovacs',
    status: 'completed',
    completedDate: '2026-10-10',
    notes: 'Chuck seal kit installed with Turmopol grease.',
    partsUsed: ['Chuck O-Ring Kit #228491']
  },
  {
    id: 'tsk-14',
    title: 'Fuel Water Separator Drain & Engine Diagnostic',
    assetId: 'ast-1',
    assetName: 'Caterpillar 320 Hydraulic Excavator',
    siteId: 'site-1',
    dueDate: '2026-10-04',
    isOverdue: false,
    priority: 'medium',
    recurrence: 'every_30_days',
    assignedMechanicId: 'user-4',
    assignedMechanicName: 'Jimmy "Mac" Kovacs',
    status: 'completed',
    completedDate: '2026-10-04',
    notes: 'Bowl drained, no water emulsification in diesel. Engine ECU clear.'
  },
  {
    id: 'tsk-15',
    title: 'Generator Oil Service & Voltage Regulation Cal',
    assetId: 'ast-4',
    assetName: 'Honda EU7000is Inverter Generator',
    siteId: 'site-1',
    dueDate: '2026-09-20',
    isOverdue: false,
    priority: 'low',
    recurrence: 'every_30_days',
    assignedMechanicId: 'user-5',
    assignedMechanicName: 'Tyler Brooks',
    status: 'completed',
    completedDate: '2026-09-20',
    notes: '1.2 qts 10W-30 synthetic oil. 120V/240V steady within +/- 1%.'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: '18 min ago',
    type: 'checkout',
    description: 'Checked out Bosch GRL 900 Rotary Laser Kit for concrete foundation survey',
    userName: 'Elena Rostova',
    siteId: 'site-1',
    itemId: 'inv-6',
    itemName: 'Bosch GRL 900 Rotary Laser Level Kit'
  },
  {
    id: 'act-2',
    timestamp: '42 min ago',
    type: 'inspection',
    description: 'Logged safety walk on JLG 600S Boom Lift. Flagged upcoming annual cable audit',
    userName: 'Jimmy Kovacs',
    siteId: 'site-1',
    itemId: 'ast-2',
    itemName: 'JLG 600S Telescopic Boom Lift'
  },
  {
    id: 'act-3',
    timestamp: '2 hours ago',
    type: 'checkin',
    description: 'Returned 2x Hilti TE 70 Rotary Hammers to Rack A-02 after core drilling',
    userName: 'Samira Khan',
    siteId: 'site-1',
    itemId: 'inv-1',
    itemName: 'Hilti TE 70-ATC Rotary Hammer'
  },
  {
    id: 'act-4',
    timestamp: '3 hours ago',
    type: 'maintenance',
    description: 'Initiated 500-Hr Hydraulic service ticket for CAT 320 Excavator',
    userName: 'Marcus Vance',
    siteId: 'site-1',
    itemId: 'ast-1',
    itemName: 'Caterpillar 320 Hydraulic Excavator'
  },
  {
    id: 'act-5',
    timestamp: '5 hours ago',
    type: 'relocation',
    description: 'Dispatched Komatsu WA380-8 to Riverside Bridge Retrofit Pier 14',
    userName: 'Frank Delgado',
    siteId: 'site-2',
    itemId: 'ast-5',
    itemName: 'Komatsu WA380-8 Wheel Loader'
  },
  {
    id: 'act-6',
    timestamp: 'Yesterday',
    type: 'checkout',
    description: 'Issued Miller Multimatic 220 AC/DC Welder to Riverside pier structural crew',
    userName: 'Frank Delgado',
    siteId: 'site-2',
    itemId: 'inv-13',
    itemName: 'Miller Multimatic 220 AC/DC Welder'
  },
  {
    id: 'act-7',
    timestamp: 'Yesterday',
    type: 'inspection',
    description: 'Overdue alert recorded: CAT 320 reached 3,400 hrs without mandatory quarterly signoff',
    userName: 'Marcus Vance',
    siteId: 'site-1',
    itemId: 'ast-1',
    itemName: 'Caterpillar 320 Hydraulic Excavator'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Overdue Equipment Inspection',
    message: 'CAT 320 Excavator is 6 days overdue for quarterly safety & hydraulic certification at Northgate Tower.',
    timestamp: '15m ago',
    read: false,
    type: 'alert'
  },
  {
    id: 'notif-2',
    title: 'Service Due Today',
    message: 'JLG 600S Boom Lift OSHA structural weld & cable inspection is scheduled for today.',
    timestamp: '1h ago',
    read: false,
    type: 'service'
  },
  {
    id: 'notif-3',
    title: 'Low Stock Threshold Reached',
    message: 'Hilti 12mm Wedge Anchor Bolts is at 4 boxes (minimum threshold is 10 boxes).',
    timestamp: '3h ago',
    read: false,
    type: 'inventory'
  },
  {
    id: 'notif-4',
    title: 'Asset Relocation Recorded',
    message: 'Komatsu WA380 Wheel Loader was dispatched to Riverside Bridge Retrofit by Frank Delgado.',
    timestamp: '5h ago',
    read: true,
    type: 'system'
  },
  {
    id: 'notif-5',
    title: 'Inspection Completed',
    message: 'Genie GS-1930 Scissor Lift pothole protection interlock test verified by Tyler Brooks.',
    timestamp: 'Yesterday',
    read: true,
    type: 'service'
  }
];

export const SAMPLE_COMPLETION_PHOTOS = [
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=70&auto=format',
  'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&q=70&auto=format',
  'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&q=70&auto=format',
  'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&q=70&auto=format'
];
