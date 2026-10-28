// Rule base. Amounts in Rs crore are POLICY CAPS, not expected payouts. Checked 26 Oct 2026.
const POLICIES = [
  {
    id: "up-ncr",
    state: "Uttar Pradesh",
    place: "Gautam Buddha Nagar (Noida) / Ghaziabad",
    src: {
      t: "Official agency summary",
      u: "https://invest.up.gov.in/wp-content/uploads/2025/08/GCC_040825.pdf",
      d: "Jun 2025",
    },
    tiers: [
      {
        n: "Level-1",
        inv: 20,
        emp: 200,
        cap: 10,
        items: [
          "Capital subsidy 25%, cap Rs 10 cr, over 7 yrs",
          "Payroll subsidy up to Rs 10 cr/yr for 3 yrs",
          "20% subsidy on lease, bandwidth, cloud, power",
          "Stamp duty 100% reimbursed",
        ],
      },
      {
        n: "Advanced",
        inv: 75,
        emp: 500,
        cap: 25,
        items: [
          "Capital subsidy 25%, cap Rs 25 cr, over 7 yrs",
          "Payroll subsidy up to Rs 20 cr/yr for 3 yrs",
          "20% subsidy on lease, bandwidth, cloud, power",
        ],
      },
    ],
    notes: [
      "Cannot be combined with other state policies; can combine with central schemes",
      "Thresholds are higher here than in the rest of UP",
    ],
  },
  {
    id: "up-rest",
    state: "Uttar Pradesh",
    place: "Lucknow, Kanpur, Varanasi and rest of UP",
    src: {
      t: "Official agency summary",
      u: "https://invest.up.gov.in/wp-content/uploads/2025/08/GCC_040825.pdf",
      d: "Jun 2025",
    },
    tiers: [
      {
        n: "Level-1",
        inv: 15,
        emp: 100,
        cap: 10,
        items: [
          "Capital subsidy 25%, cap Rs 10 cr, over 7 yrs",
          "Payroll subsidy up to Rs 10 cr/yr for 3 yrs",
          "20% subsidy on lease, bandwidth, cloud, power",
          "Land subsidy 30-50% on authority plots",
        ],
      },
      {
        n: "Advanced",
        inv: 50,
        emp: 300,
        cap: 25,
        items: [
          "Capital subsidy 25%, cap Rs 25 cr, over 7 yrs",
          "Payroll subsidy up to Rs 20 cr/yr for 3 yrs",
          "Case-by-case package above Rs 250 cr or 1,500 jobs",
        ],
      },
    ],
    notes: [
      "Cannot be combined with other state policies; can combine with central schemes",
    ],
  },
  {
    id: "mh-z1",
    state: "Maharashtra",
    place: "Zone I: Mumbai and Pune metro regions",
    src: {
      t: "Professional-firm summary (RSM)",
      u: "https://www.rsm.global/india/sites/default/files/media/publications/2025/RSM%20India%20Newsflash%20-%20Maharashtra%20Introduces%20the%20GCC%20Policy%202025%20-%20Key%20Highlights%20%26%20Incentives.pdf",
      d: "29 Nov 2025",
    },
    tiers: [
      { n: "Small", inv: 50, emp: 100, cap: 10 },
      { n: "Medium", inv: 100, emp: 250, cap: 20 },
      { n: "Large", inv: 250, emp: 500, cap: 50 },
      { n: "Mega", inv: 500, emp: 750, cap: 100 },
    ].map(t => ({
      ...t,
      items: [
        "Capital subsidy 20% on plant and machinery, cap Rs " + t.cap + " cr",
        "Rent assistance 10% of rent, 5 yrs (new units only)",
        "Payroll: 40% of pay above Rs 1 lakh/month, cap Rs 5 cr/yr, 3 yrs",
      ],
    })),
    notes: [
      "Excludes BPO, call centres and pure sales units",
      "Total state support capped at 100% of fixed capital investment",
      "Official policy PDF not read directly",
    ],
  },
  {
    id: "mh-z2",
    state: "Maharashtra",
    place: "Zone II: Nagpur, Nashik, Chhatrapati Sambhajinagar, rest of state",
    src: {
      t: "Professional-firm summary (RSM)",
      u: "https://www.rsm.global/india/sites/default/files/media/publications/2025/RSM%20India%20Newsflash%20-%20Maharashtra%20Introduces%20the%20GCC%20Policy%202025%20-%20Key%20Highlights%20%26%20Incentives.pdf",
      d: "29 Nov 2025",
    },
    tiers: [
      { n: "Small", inv: 50, emp: 100, cap: 10 },
      { n: "Medium", inv: 100, emp: 250, cap: 20 },
      { n: "Large", inv: 250, emp: 500, cap: 50 },
      { n: "Mega", inv: 500, emp: 750, cap: 100 },
    ].map(t => ({
      ...t,
      items: [
        "Capital subsidy 20% on plant and machinery, cap Rs " + t.cap + " cr",
        "Rent assistance 20% of rent, 5 yrs (new units only)",
        "Payroll: 50% of pay above Rs 1 lakh/month, cap Rs 5 cr/yr, 3 yrs",
        "Interest subsidy up to 5% (Zone II only)",
      ],
    })),
    notes: [
      "Excludes BPO, call centres and pure sales units",
      "Official policy PDF not read directly",
    ],
  },
  {
    id: "ka-blr",
    state: "Karnataka",
    place: "Bengaluru Urban District",
    src: {
      t: "Official policy text (third-party host)",
      u: "https://ssfglobal.in/wp-content/uploads/2025/07/karnataka-gcc-policy-2024-29.pdf",
      d: "Nov 2024",
    },
    tiers: [
      {
        n: "General support only",
        inv: 0,
        emp: 0,
        cap: 5,
        items: [
          "Innovation lab capex support 40%, cap Rs 5 cr (2 projects a year in the district)",
          "Skilling, internship, patent and certification reimbursements",
        ],
      },
    ],
    notes: [
      "No rent, payroll, EPF or property-tax support inside Bengaluru Urban",
    ],
  },
  {
    id: "ka-bb",
    state: "Karnataka",
    place:
      "Beyond Bengaluru: Mysuru, Mangaluru, Hubballi-Dharwad-Belagavi, Tumakuru, Kalaburagi, Shivamogga",
    src: {
      t: "Official policy text (third-party host)",
      u: "https://ssfglobal.in/wp-content/uploads/2025/07/karnataka-gcc-policy-2024-29.pdf",
      d: "Nov 2024",
    },
    tiers: [
      {
        n: "Nano GCC (5-50 employees)",
        emp: 5,
        empMax: 50,
        cap: 0,
        items: [
          "Eligible for Beyond Bengaluru support without employment or investment thresholds (detail not itemised in the policy text read)",
        ],
      },
      {
        n: "100+ employees",
        emp: 100,
        cap: 0.5,
        items: [
          "Rent 50%, first year, up to Rs 0.5 cr (max 10 GCCs a year)",
          "EPF up to Rs 3,000/employee/month, 2 yrs",
          "Property tax 30% for 3 yrs; electricity duty 100% for 5 yrs",
          "Recruitment aid 10-50% by hires, up to Rs 7 cr",
        ],
      },
      {
        n: "500+ employees",
        emp: 500,
        cap: 2,
        items: [
          "Rent 50%, first year, up to Rs 2 cr (max 6 GCCs a year)",
          "EPF, property tax, power duty and recruitment aid as above",
        ],
      },
    ],
    notes: [
      "Many incentives have annual beneficiary caps, so availability is not guaranteed",
    ],
  },
  {
    id: "gj",
    state: "Gujarat",
    place: "Gujarat (incl. GIFT City, Ahmedabad, Gandhinagar)",
    src: {
      t: "Government resolution via professional summaries",
      u: "https://api.giftgujarat.in/public/GCC_Policy.pdf",
      d: "11 Feb 2025",
    },
    tiers: [
      {
        n: "Category I (investment under Rs 250 cr)",
        emp: 50,
        invMax: 250,
        cap: 50,
        items: [
          "Capex support 20% (non-IT) or 30% (IT assets), cap Rs 50 cr",
          "One-time 50% of one month's pay per new local hire (up to Rs 50k male / Rs 60k female)",
          "EPF 100% women / 75% men, 5 yrs; electricity duty waived 5 yrs",
        ],
      },
      {
        n: "Category II (Rs 250 cr or more)",
        emp: 50,
        needInv: 250,
        cap: 200,
        items: [
          "Capex support up to Rs 200 cr",
          "Employment and EPF support as in Category I",
        ],
      },
    ],
    notes: [
      "Minimum 50 employees on payroll",
      "Operational Guidelines 1.0 reported Oct 2026; not yet reviewed",
    ],
  },
];

if (typeof module !== "undefined") module.exports = POLICIES;
