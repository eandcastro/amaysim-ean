
const PRODUCT_CODES = {
  ULT_SMALL: 'ult_small',
  ULT_MEDIUM: 'ult_medium',
  ULT_LARGE: 'ult_large',
  ONEGB: '1gb',
};

const PRODUCT_DEFAULTS = {
  [PRODUCT_CODES.ULT_SMALL]: {
      name: 'Unlimited 1GB',
      price: 24.90,
  },
  [PRODUCT_CODES.ULT_MEDIUM]: {
      name: 'Unlimited 2GB',
      price: 29.90,
  },
  [PRODUCT_CODES.ULT_LARGE]: {
      name: 'Unlimited 5GB',
      price: 44.90,
  },
  [PRODUCT_CODES.ONEGB]: {
      name: '1 GB Data-pack',
      price: 9.90,
  },
}

const DISCOUNT_TYPE = {
  PERCENT: 'percent',
}

const PROMO_CODES = [
  { code: 'I<3AMAYSIM', discount: 10, type: DISCOUNT_TYPE.PERCENT }
]

const PRICE_RULES = [
  'pricingRule1Gb',
  'pricingRule2Gb',
  'pricingRule5Gb',
]

class Product {
  code: string
  name: string
  price: number | undefined
  constructor({code, name, price}: {code: string, name: string, price: number | undefined }) {
      this.code = code
      this.name = name
      this.price = price
  }
}
class ShoppingCart {
  promoCodes: any[]
  items: any[]
  totalPrice: number
  pricingRules: string[]

  constructor (pricingRules: string[]) {
      this.promoCodes = PROMO_CODES
      this.items = []
      this.totalPrice = 0
      this.pricingRules = pricingRules
  }

  productFactory(productCode: string, price?: number) {
      // Validate if product code exists
      const item = PRODUCT_DEFAULTS[productCode]
      
      if (!item) {
          console.error('INVALID_PRODUCT_CODE')
      }
      
      const newProduct = new Product({code: productCode, name: item.name, price: price !== null && !Number.isNaN(Number(price)) ? price : item.price})

      return newProduct
  }

  async addItem(product: any, promoCode?: string) {
      this.items.push(product)

      await this.computePrice(promoCode)
  }

  async computePrice (promoCode?: string) {
      if (this.pricingRules.length !== 0) {
          this.pricingRules.forEach((pricingRule) => {
              switch (pricingRule) {
                  case "pricingRule1Gb": this.pricingRule1Gb(); break;
                  case "pricingRule2Gb": this.pricingRule2Gb(); break;
                  case "pricingRule5Gb": this.pricingRule5Gb(); break;
                  default: null
              }
          })
      }

      let subTotal: number = this.items.reduce((sum, curr) => { return sum + parseFloat(curr.price)}, 0)
      
      let availedPromo = PROMO_CODES.find((item) => {return item.code === promoCode })
      if (availedPromo) {
          if (availedPromo.type === DISCOUNT_TYPE.PERCENT) {
            subTotal = Number(Number(subTotal - (subTotal * (availedPromo.discount / 100))).toFixed(2));
          }
      }

      this.totalPrice = Number(subTotal.toFixed(2))
  }

  async pricingRule1Gb() {
      let counter: number = 0

      for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].code === PRODUCT_CODES.ULT_SMALL) {
              counter += 1
              if (counter % 3 === 0) {
                  this.items[i].price = 0
                  counter = 0
              }
          }
      }

  }

  async pricingRule2Gb() {
      const countMedium: number = this.items.reduce((count, item) => {
          return item.code === PRODUCT_CODES.ULT_MEDIUM ? count + 1 : count;
      }, 0)

      if (countMedium > 0) {
          const freeDataPacks = this.productFactory(PRODUCT_CODES.ONEGB, 0)

          this.items.push(freeDataPacks);
      }

  }

  async pricingRule5Gb() {
      const all5Gb: any[] = this.items.filter((item) => {return item.code === PRODUCT_CODES.ULT_LARGE})

      if (all5Gb.length >= 3) {
          this.items.map((item) => { return item.code === PRODUCT_CODES.ULT_LARGE ? item.price = 39.9 : item.price })
      }
  }
}


const shoppingCart = new ShoppingCart(['pricingRule1Gb', 'pricingRule2Gb', 'pricingRule5Gb'])

shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_SMALL))
shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_SMALL))
shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_SMALL))
shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_LARGE))

// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_SMALL))
// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_SMALL))
// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_LARGE))
// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_LARGE))
// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_LARGE))
// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_LARGE))


// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_SMALL))
// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_MEDIUM))
// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_MEDIUM))

// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ULT_SMALL))
// shoppingCart.addItem(shoppingCart.productFactory(PRODUCT_CODES.ONEGB), 'I<3AMAYSIM')
console.log('items', shoppingCart.items)
console.log('total price', shoppingCart.totalPrice)
