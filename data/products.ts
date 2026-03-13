import { Product, Category } from "../types";

export const categories: Category[] = [
  {
    id: "nuts",
    name: "Premium Nuts",
    slug: "premium-nuts",
    image: "https://images.unsplash.com/photo-1596501048141-5ac42966838b?q=80&w=800&auto=format&fit=crop",
    color: "bg-brand-brown",
    textColor: "text-brand-cream"
  },
  {
    id: "seeds",
    name: "Organic Seeds",
    slug: "organic-seeds",
    image: "https://images.unsplash.com/photo-1515942661900-94b3d197c591?q=80&w=800&auto=format&fit=crop",
    color: "bg-brand-cocoa",
    textColor: "text-brand-cream"
  },
  {
    id: "dried-fruits",
    name: "Dried Fruits",
    slug: "dried-fruits",
    image: "https://images.unsplash.com/photo-1596003906949-67221c37965c?q=80&w=800&auto=format&fit=crop",
    color: "bg-brand-plum",
    textColor: "text-brand-cream"
  },
  {
    id: "mixes",
    name: "Healthy Mixes",
    slug: "healthy-mixes",
    image: "https://images.unsplash.com/photo-1533602952207-7bc97063d893?q=80&w=800&auto=format&fit=crop",
    color: "bg-brand-brown",
    textColor: "text-brand-cream"
  }
];

export const products: Product[] = [
  {
    id: "1",
    slug: "premium-california-almonds",
    name: "Premium California Almonds",
    price: 899,
    originalPrice: 1199,
    category: "nuts",
    image: "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511018556340-d16906a10aa4?q=80&w=800&auto=format&fit=crop"
    ],
    badge: "Bestseller",
    isBestseller: true,
    description: "Our Premium California Almonds are carefully selected for their size and crunch. They are 100% natural, protein-rich, and perfect for your daily nutrition. Each almond is hand-picked to ensure consistent quality and maximum nutrient retention. Great for snacking, baking, or adding to your morning cereal.",
    weight: "500g",
    variants: ["250g", "500g", "1kg"],
    rating: 4.8,
    reviewCount: 156,
    nutrition: [
      { label: "Protein", value: "21g" },
      { label: "Fats", value: "49g" },
      { label: "Carbs", value: "22g" },
      { label: "Fiber", value: "12g" }
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
    slug: "organic-cashew-nuts",
    name: "Organic Cashew Nuts",
    price: 749,
    originalPrice: 999,
    category: "nuts",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567434720166-7281c7e96b3a?q=80&w=800&auto=format&fit=crop"
    ],
    badge: "New",
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
    slug: "medjool-dates",
    name: "Premium Medjool Dates",
    price: 1299,
    originalPrice: 1599,
    category: "dried-fruits",
    image: "https://images.unsplash.com/photo-1596003906949-67221c37965c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596003906949-67221c37965c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501747315-124a0ecca060?q=80&w=800&auto=format&fit=crop"
    ],
    badge: "Imported",
    description: "Known as the 'King of Dates', our Medjool dates are exceptionally large, sweet, and soft. Naturally high in energy and fiber, they are the perfect natural sweetener for your smoothies and desserts.",
    weight: "500g",
    variants: ["500g", "1kg"],
    rating: 4.7,
    reviewCount: 120,
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
    slug: "roasted-pistachios",
    name: "Salted Roasted Pistachios",
    price: 1099,
    originalPrice: 1399,
    category: "nuts",
    image: "https://images.unsplash.com/photo-1596501048141-5ac42966838b?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596501048141-5ac42966838b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522307751700-6dc574929851?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Premium California pistachios, lightly salted and roasted to perfection. These are naturally opened and offer a great source of protein and antioxidants. Ideal for a healthy lifestyle snack.",
    weight: "500g",
    variants: ["250g", "500g"],
    rating: 4.9,
    reviewCount: 210,
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
    slug: "walnut-kernels",
    name: "Premium Walnut Kernels",
    price: 649,
    originalPrice: 899,
    category: "nuts",
    image: "https://images.unsplash.com/photo-1543325252-45e046637e93?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1543325252-45e046637e93?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Snow-white walnut kernels, rich in Omega-3 fatty acids. These halves are perfect for brain health and make a great addition to salads and brownies.",
    weight: "250g",
    variants: ["250g", "500g"],
    rating: 4.6,
    reviewCount: 95,
    nutrition: [
      { label: "Omega-3", value: "2.5g" },
      { label: "Protein", value: "15g" }
    ],
    reviews: []
  },
  {
    id: "6",
    slug: "mixed-seeds-pack",
    name: "7-in-1 Super Seeds Mix",
    price: 499,
    originalPrice: 599,
    category: "seeds",
    image: "https://images.unsplash.com/photo-1515942661900-94b3d197c591?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515942661900-94b3d197c591?q=80&w=800&auto=format&fit=crop"
    ],
    badge: "Healthy Choice",
    description: "A powerhouse of nutrition featuring Pumpkin, Sunflower, Flax, Chia, Watermelon, Sesame, and Muskmelon seeds. Lightly roasted for a crunch.",
    weight: "400g",
    variants: ["400g", "800g"],
    rating: 4.8,
    reviewCount: 312,
    nutrition: [
      { label: "Fiber", value: "18g" },
      { label: "Protein", value: "25g" }
    ],
    reviews: []
  }
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
    rating: ,4
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