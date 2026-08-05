export const cakeSubcategories = ['Fresh Cakes', 'Butter Cakes', 'Dry Cakes']

export const bakeryCategories = [
  'All',
  'Cakes',
  ...cakeSubcategories,
  'Cupcakes',
  'Pastries',
  'Donuts',
  'Cookies',
  'Brownies',
  'Desserts',
]

export const mainBakeryCategories = bakeryCategories.filter((category) => !cakeSubcategories.includes(category))
export const adminMainCategories = mainBakeryCategories.filter((category) => category !== 'All')
export const cakeCategoryOptions = ['Cakes', ...cakeSubcategories]
export const isCakeCategory = (category) => category === 'Cakes' || cakeSubcategories.includes(category)
export const getMainBakeryCategory = (category) => (isCakeCategory(category) ? 'Cakes' : category)

export const bakeryProducts = [
  {
    id: 'cake-01',
    name: 'Strawberry Velvet Cake',
    category: 'Fresh Cakes',
    price: 34,
    stock: 12,
    bestSeller: true,
    featured: true,
    rating: 4.9,
    image:
      'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Soft strawberry sponge layered with whipped cream and fresh berries.',
  },
  {
    id: 'cake-02',
    name: 'Triple Chocolate Truffle Cake',
    category: 'Butter Cakes',
    price: 38,
    stock: 10,
    bestSeller: true,
    featured: true,
    rating: 4.8,
    image:
      'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Dark, milk, and white chocolate layers finished with glossy ganache.',
  },
  {
    id: 'cupcake-01',
    name: 'Vanilla Sprinkle Cupcakes',
    category: 'Cupcakes',
    price: 4,
    stock: 40,
    bestSeller: false,
    featured: true,
    rating: 4.7,
    image:
      'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Classic vanilla cupcakes with rainbow sprinkles and buttercream swirls.',
  },
  {
    id: 'cupcake-02',
    name: 'Red Velvet Cream Cupcakes',
    category: 'Cupcakes',
    price: 5,
    stock: 34,
    bestSeller: true,
    featured: false,
    rating: 4.9,
    image:
      'https://images.pexels.com/photos/913136/pexels-photo-913136.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Moist red velvet cupcakes with tangy cream cheese frosting.',
  },
  {
    id: 'pastry-01',
    name: 'Caramel Pecan Danish',
    category: 'Pastries',
    price: 6,
    stock: 25,
    bestSeller: false,
    featured: true,
    rating: 4.6,
    image:
      'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Flaky danish folded with caramel glaze and roasted pecans.',
  },
  {
    id: 'pastry-02',
    name: 'Berry Cream Puff',
    category: 'Pastries',
    price: 7,
    stock: 20,
    bestSeller: true,
    featured: false,
    rating: 4.8,
    image:
      'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Crisp choux pastry filled with vanilla cream and mixed berries.',
  },
  {
    id: 'donut-01',
    name: 'Classic Glazed Donut Box',
    category: 'Donuts',
    price: 12,
    stock: 22,
    bestSeller: true,
    featured: true,
    rating: 4.7,
    image:
      'https://images.pexels.com/photos/4686835/pexels-photo-4686835.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Six fluffy ring donuts coated in shiny vanilla glaze.',
  },
  {
    id: 'donut-02',
    name: 'Chocolate Sprinkle Donuts',
    category: 'Donuts',
    price: 13,
    stock: 20,
    bestSeller: false,
    featured: false,
    rating: 4.6,
    image:
      'https://images.pexels.com/photos/3776942/pexels-photo-3776942.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Rich cocoa glaze with crunchy confetti sprinkles.',
  },
  {
    id: 'cookie-01',
    name: 'Sea Salt Choco Chip Cookies',
    category: 'Cookies',
    price: 9,
    stock: 50,
    bestSeller: true,
    featured: true,
    rating: 4.9,
    image:
      'https://images.pexels.com/photos/2303256/pexels-photo-2303256.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Chewy center, crispy edge, and premium dark chocolate chunks.',
  },
  {
    id: 'cookie-02',
    name: 'Pistachio Butter Cookies',
    category: 'Cookies',
    price: 10,
    stock: 32,
    bestSeller: false,
    featured: false,
    rating: 4.5,
    image:
      'https://images.pexels.com/photos/7525184/pexels-photo-7525184.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Crumbly butter cookies with pistachio crunch and vanilla aroma.',
  },
  {
    id: 'brownie-01',
    name: 'Fudge Walnut Brownies',
    category: 'Brownies',
    price: 11,
    stock: 28,
    bestSeller: true,
    featured: true,
    rating: 4.8,
    image:
      'https://images.pexels.com/photos/2067436/pexels-photo-2067436.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Dense fudge brownies packed with toasted walnuts.',
  },
  {
    id: 'brownie-02',
    name: 'Salted Caramel Brownie Bites',
    category: 'Brownies',
    price: 12,
    stock: 24,
    bestSeller: false,
    featured: false,
    rating: 4.7,
    image:
      'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Bite-size brownies with caramel ribbons and sea salt flakes.',
  },
  {
    id: 'dessert-01',
    name: 'Mango Mousse Cups',
    category: 'Desserts',
    price: 8,
    stock: 30,
    bestSeller: true,
    featured: true,
    rating: 4.8,
    image:
      'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Creamy mango mousse layered with sponge and fruit glaze.',
  },
  {
    id: 'dessert-02',
    name: 'Mini Tiramisu Jars',
    category: 'Desserts',
    price: 9,
    stock: 26,
    bestSeller: false,
    featured: false,
    rating: 4.7,
    image:
      'https://images.pexels.com/photos/3026810/pexels-photo-3026810.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Coffee-soaked sponge with mascarpone cream in travel jars.',
  },
]

export const testimonials = [
  {
    id: 't1',
    name: 'Ayesha Noor',
    quote:
      'The custom unicorn cake was exactly what my daughter imagined. Fresh, beautiful, and delivered right on time.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Hassan Malik',
    quote:
      'Best brownies in the city. The order tracking updates were clear and payment was smooth.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Sara Khan',
    quote:
      'I order cupcakes for office events every month. Always fresh and the packaging is premium.',
    rating: 4,
  },
]
