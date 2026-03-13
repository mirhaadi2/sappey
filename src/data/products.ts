import { Product, Category } from "../types";

export const categories: Category[] = [
  {
    id: "cashews",
    name: "Cashews",
    slug: "cashews",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png",
    color: "bg-brand-brown",
    textColor: "text-brand-cream"
  },
  {
    id: "almonds",
    name: "Almonds",
    slug: "almonds",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_3.png",
    color: "bg-brand-cocoa",
    textColor: "text-brand-cream"
  },
  {
    id: "mixed",
    name: "Mixed Fruits",
    slug: "mixed",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png",
    color: "bg-brand-plum",
    textColor: "text-brand-cream"
  },
  {
    id: "combos",
    name: "Combos",
    slug: "combos",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png",
    color: "bg-brand-brown",
    textColor: "text-brand-cream"
  }
];

export const products: Product[] = [
  {
    id: "1",
    slug: "premium-cashews-w240",
    name: "Premium Cashews W240",
    price: 12.99,
    originalPrice: 16.99,
    category: "cashews",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png",
    images: [
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png"
    ],
    badge: "Bestseller",
    description: "Our Premium California Cashews are carefully selected for their size and crunch. They are 100% natural, protein-rich, and perfect for your daily nutrition. Each cashew is hand-picked to ensure consistent quality and maximum nutrient retention. Great for snacking, baking, or adding to your morning cereal.",
    weight: "500g",
    variants: ["250g", "500g", "1kg"],
    rating: 4.8,
    reviewCount: 156,
    isBestseller: true,
    nutrition: [
      { label: "Calories", value: "553 kcal" },
      { label: "Protien", value: "18g" },
      { label: "Fat", value: "44g" },
      { label: "Fiber", value: "3g" },
      { label: "Sodium", value: "12mg" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Sarah J.",
        rating: 5,
        comment: "The best quality almonds I've ever bought online. Very crunchy and fresh!",
        date: "2024-03-10"
      },
      {
        id: "r2",
        author: "Michael R.",
        rating: 4,
        comment: "Fresh and delicious. Packaging was excellent and kept them crisp.",
        date: "2024-03-05"
      }
    ]
  },
  {
    id: "2",
    slug: "california-almonds",
    name: "California Almonds",
    price: 9.99,
    originalPrice: 13.99,
    category: "nuts",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png",
    images: [
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_3.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png"
    ],
    badge: "New Arrival",
    isNew: true,
    description: "Creamy and delicious organic cashews sourced from sustainable farms. These whole cashews are perfect for snacking or as a nutritious addition to your recipes. They are processed in a hygienic facility to maintain their natural sweetness and buttery texture.",
    weight: "500g",
    variants: ["250g", "500g", "1kg"],
    rating: 4.9,
    reviewCount: 89,
    nutrition: [
      { label: "Protein", value: "18g" },
      { label: "Fats", value: "44g" },
      { label: "Carbs", value: "30g" },
      { label: "Fiber", value: "3.3g" }
    ],
    reviews: [
      {
        id: "r3",
        author: "Anita P.",
        rating: 5,
        comment: "Very creamy and large sized cashews. Highly recommended for festive gifting too.",
        date: "2024-03-12"
      }
    ]
  },
  {
    id: "3",
    slug: "mixed-nuts-delight",
    name: "Mixed Nuts Delight",
    price: 12.99,
    originalPrice: 15.99,
    category: "mixed",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png",
    images: [
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png"
    ],
    badge: "Bestseller",
    description: "Known as the 'King of Dates', our Medjool dates are exceptionally large, sweet, and soft. Naturally high in energy and fiber, they are the perfect natural sweetener for your smoothies and desserts.",
    weight: "500g",
    variants: ["500g", "1kg"],
    rating: 4.7,
    reviewCount: 120,
    isBestseller: true,
    nutrition: [
      { label: "Fiber", value: "7g" },
      { label: "Energy", value: "277kcal" },
      { label: "Iron", value: "1mg" },
      { label: "Potassium", value: "696mg" }
    ],
    reviews: [
      {
        id: "r4",
        author: "David K.",
        rating: 5,
        comment: "Incredibly soft and sweet. Best dates I've ever had.",
        date: "2024-02-28"
      }
    ]
  },
  {
    id: "4",
    slug: "dry-fruits-combo-pack",
    name: "Dry Fruits Combo Pack",
    price: 24.99,
    originalPrice: 32.99,
    category: "combos",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png",
    images: [
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png"
    ],
    badge: "New Arrival",
    description: "Premium California pistachios, lightly salted and roasted to perfection. These are naturally opened and offer a great source of protein and antioxidants. Ideal for a healthy lifestyle snack.",
    weight: "500g",
    variants: ["250g", "500g"],
    rating: 4.9,
    reviewCount: 210,
    isNew: true,
    nutrition: [
      { label: "Protein", value: "20g" },
      { label: "Iron", value: "3.9mg" },
      { label: "Calcium", value: "105mg" }
    ],
    reviews: [
      {
        id: "r5",
        author: "Rahul M.",
        rating: 5,
        comment: "Perfectly roasted. Hardly any closed shells in the pack!",
        date: "2024-03-01"
      }
    ]
  },
  {
    id: "5",
    slug: "roasted-pistachios",
    name: "Roasted Pistachios",
    price: 11.99,
    originalPrice: 19.99,
    category: "mixed",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png",
    images: [
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png"
    ],
    badge: "New Arrival",
    description: "Snow-white walnut kernels, rich in Omega-3 fatty acids. These halves are perfect for brain health and make a great addition to salads and brownies.",
    weight: "250g",
    variants: ["250g", "500g"],
    rating: 4.6,
    reviewCount: 95,
    isNew: true,
    nutrition: [
      { label: "Omega-3", value: "2.5g" },
      { label: "Protein", value: "15g" }
    ],
    reviews: [
      {
        id: "r9",
        author: "Kavya L.",
        rating: 5,
        comment: "Perfect roast level, not too salty!",
        date: "2024-03-08"
      }
    ]
  },
  {
    id: "6",
    slug: "premium-walnuts",
    name: "Premium Walnuts",
    price: 13.99,
    originalPrice: 17.99,
    category: "mixed",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png",
    images: [
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_5.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png"
    ],
    badge: "Bestseller",
    description: "A powerhouse of nutrition featuring Pumpkin, Sunflower, Flax, Chia, Watermelon, Sesame, and Muskmelon seeds. Lightly roasted for a crunch.",
    weight: "400g",
    variants: ["400g", "800g"],
    rating: 4.8,
    reviewCount: 312,
    isBestseller: true,
    nutrition: [
      { label: "Fiber", value: "18g" },
      { label: "Protein", value: "25g" }
    ],
    reviews: [
      {
        id: "r10",
        author: "Nisha B.",
        rating: 5,
        comment: "Perfect roast level, not too salty!",
        date: "2024-02-18"
      }
    ]
  },
  {
    id: "7",
    slug: "jumbo-cashews-w180",
    name: "Jumbo Cashews W180",
    price: 13.99,
    originalPrice: 23.99,
    category: "cashews",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png",
    images: [
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_4.png"
    ],
    badge: "Premium",
    description: "A powerhouse of nutrition featuring Pumpkin, Sunflower, Flax, Chia, Watermelon, Sesame, and Muskmelon seeds. Lightly roasted for a crunch.",
    weight: "250g",
    variants: ["400g", "800g"],
    rating: 4.9,
    reviewCount: 56,
    isBestseller: true,
    nutrition: [
      { label: "Fiber", value: "18g" },
      { label: "Protein", value: "25g" }
    ],
    reviews: [
      {
        id: "r10",
        author: "Nisha B.",
        rating: 5,
        comment: "Perfect roast level, not too salty!",
        date: "2024-02-18"
      }
    ]
  },
  {
    id: "8",
    slug: "almond-cashew-combo",
    name: "Almond & Cashew Combo",
    price: 19.99,
    originalPrice: 26.99,
    category: "combos",
    image: "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_3.png",
    images: [
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_3.png",
      "https://c.animaapp.com/mmlqdzfpT0CVfh/img/ai_2.png"
    ],
    badge: "New Arrival",
    description: "Snow-white walnut kernels, rich in Omega-3 fatty acids. These halves are perfect for brain health and make a great addition to salads and brownies.",
    weight: "250g",
    variants: ["250g", "500g"],
    rating: 4.8,
    reviewCount: 34,
    isNew: true,
    nutrition: [
      { label: "Calories", value: "566 kcal" },
      { label: "Protein", value: "19g" },
      { label: "Carbohydrates", value: "26g" },
      { label: "Fat", value: "47g" },
    ],
    reviews: [
      {
        id: "r9",
        author: "Kavya L.",
        rating: 5,
        comment: "Perfect roast level, not too salty!",
        date: "2024-03-08"
      }
    ]
  },
];

export const testimonials = [
  {
    id: "t1",
    author: "Priya Mehta",
    location: "Mumbai",
    rating: 5,
    comment: "Krunch has completely changed my snacking habits. The cashews are so fresh and the packaging is beautiful. I gift these to everyone!",
    initials: "PM"
  },
  {
    id: "t2",
    author: "Rahul Sharma",
    location: "Delhi",
    rating: 5,
    comment: "Best quality dry fruits I've found online. The mixed nuts combo is my daily go to. Fast delivery and excellent freshness",
    initials: "RS"
  },
  {
    id: "t3",
    author: "Anita Krishnan",
    location: "Bengalore",
    rating: 5,
    comment: "I've been ordering from kruncho for 6 months now. Consistent quality every single time. The almonds are absolutely top-notch.",
    initials: "AK"
  },
  {
    id: "t4",
    author: "Vikram Patel",
    location: "Ahmedabad",
    rating: 4,
    comment: "Great products and very reasonable prices. The combo packs are perfect for families. Will definitely recommend to friends",
    initials: "VP"
  },
  {
    id: "t5",
    author: "Deepa Nair",
    location: "Chennai",
    rating: 5,
    comment: "The freshness in unmatched! You can tell these are carefully sourced. My kids love the mixed nuts as an after-school snack.",
    initials: "DN"
  },
]