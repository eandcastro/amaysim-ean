import { INVALID_INPUT_DATA, INVALID_PRODUCT_CODE, INVALID_PROMO_CODE } from "./error-constants.mjs"
import { ULT_LARGE, ULT_MEDIUM, ULT_SMALL } from "./generic-constants.mjs"

const productList = [
  {
    productCode: 'ult_small',
    productName: 'Unlimited 1GB',
    price: 24.90
  },
  {
    productCode: 'ult_medium',
    productName: 'Unlimited 2GB',
    price: 29.90
  },
  {
    productCode: 'ult_large',
    productName: 'Unlimited 5GB',
    price: 44.90
  },
  {
    productCode: '1gb',
    productName: '1 GB Data-pack',
    price: 9.90
  }
]

export class ShoppingCart {
  #promoCodes
  constructor () {
    this.#promoCodes = ['I<3AMAYSIM']
    this.productItems = []
    this.itemPrices = []
    this.totalPrice
    this.hasPromoCode = false
  }

  async addItem(productCode, promoCode) {
    const regex = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.>\/?~]/

    // Validate if input type is valid
    if (!productCode || typeof productCode !== 'string') {
      throw new Error(INVALID_INPUT_DATA, { cause: 'Input data is not a string' })
    }

    // Validate if productCode or promoCode is using other special characters
    if (regex.test(productCode) || (promoCode && regex.test(promoCode))) {
      throw new Error(INVALID_INPUT_DATA, { cause: 'Input data contains special characters that are not allowed' })
    }

    // Validate if product code exists
    const item = productList.filter((product) => { return product.productCode === productCode })[0]

    if (!item) {
      throw new Error(INVALID_PRODUCT_CODE, { cause: 'Product code does not exists' })
    }

    // Validate if promo code exists
    if (promoCode && !this.#promoCodes.includes(promoCode)) {
      throw new Error(INVALID_PROMO_CODE, { cause: 'Promo code does not exists' })
    }

    // Assign hasPromoCode to true if and only if promoCode exists and promoCodes includes promoCode
    if (promoCode && this.#promoCodes.includes(promoCode)) {
      this.hasPromoCode = true
    }

    this.productItems.push(item)
  }

  // PERSONAL NOTE: MADE THIS AS REUSABLE METHOD AS THIS IS REDUDANTLY USED
  async filterProductItems (productCode) {
    return this.productItems.map((productItem) => { return productItem.productCode === productCode }).filter(item => { return item })
  }

  async #check1GbSpecialPromo () {
    const filtered1GbProductItems = await this.filterProductItems(ULT_SMALL)

    if (filtered1GbProductItems.length >= 3) {
      for (let i = 0; i < filtered1GbProductItems.length; i++) {
        if (i != 0 && (i + 1) % 3 === 0) {
          this.totalPrice = parseFloat(this.totalPrice) - 24.90
        }
      }
    }
  }

  async #check2GbSpecialPromo () {
    const filtered2GbProductItems = await this.filterProductItems(ULT_MEDIUM)

    for (let i = 0; i < filtered2GbProductItems.length; i++) {
      this.productItems.push({
        productCode: '1gb',
        productName: '1 GB Data-pack',
        price: 0
      })
    }
  }

  async #check5GbSpecialPromo () {
    const filtered5GbProductItems = await this.filterProductItems(ULT_LARGE)

    if (filtered5GbProductItems.length > 3) {
      this.productItems.map((item) => { return item.productCode === ULT_LARGE ? item.price = 39.9 : item.price })
    }
  }

  async #applyDiscount () {
    this.totalPrice = (parseFloat(this.totalPrice) - (parseFloat(this.totalPrice) * .1))
  }

  async getTotalPrice() {    
    // Check if user is subscribed for the 1st month - mocking the value for now
    // One month = 2,592,000 for 30-day months

    // const userSubscribedTimestamp = new Date()
    // const promoExpirationTimestamp = 1683215250 + 2592000

    // if (userSubscribedTimestamp === promoExpirationTimestamp) {
      // Checking of promo will happen here
      await this.#check2GbSpecialPromo()
      await this.#check5GbSpecialPromo()
    // }
    

    this.itemPrices = [...this.productItems.map((productItem) => { return parseFloat(productItem.price) })]
    this.totalPrice = this.itemPrices.reduce((prev, curr) => { return prev + curr }, 0)
    
    // if (userSubscribedTimestamp === promoExpirationTimestamp) {
      await this.#check1GbSpecialPromo()
    // }
    
    if (this.hasPromoCode) {
      await this.#applyDiscount()
    }

    // console.log('HAS DISCOUNT ', this.hasPromoCode)
    // console.log('FINAL PRODUCT ITEMS: ', this.productItems.sort((a, b) => b.price - a.price ))
    // console.log(`FINAL PRICE: $${parseFloat(this.totalPrice).toFixed(2)}`)

  }
}

const cart = new ShoppingCart()

// TEST HERE
// The Unlimited 5GB Sim will have a bulk discount applied; whereby the price will drop to $39.90 each for the first month, if the customer buys more than 3.
// cart.addItem('ult_large')
// cart.addItem('ult_large')
// cart.addItem('ult_large')
// cart.addItem('ult_large')
// cart.addItem('ult_large')
// cart.addItem('ult_small')

// A 3 for 2 deal on Unlimited 1GB Sims. So for example, if you buy 3 Unlimited 1GB  Sims, you will pay the price of 2 only for the first month.
// cart.addItem('ult_small')
// cart.addItem('ult_small')
// cart.addItem('ult_small')
// cart.addItem('ult_small')
// cart.addItem('ult_small')
// cart.addItem('ult_small')

// We will bundle in a free 1 GB Data-pack free-of-charge with every Unlimited 2GB sold
// cart.addItem('ult_medium')
// cart.addItem('ult_medium')

// Adding the promo code 'I<3AMAYSIM' will apply a 10% discount across the board.
// cart.addItem('ult_small')
// cart.addItem('ult_medium', 'I<3AMAYSIM')

// Invalid product code
// cart.addItem('ult_smalla', 'I<3AMAYSIM')

// Invalid promo code
// cart.addItem('ult_small', 'I<3AMAYSIMS')

// SCENARIO 1
// cart.addItem('ult_small')
// cart.addItem('ult_small')
// cart.addItem('ult_small')
// cart.addItem('ult_large')

// SCENARIO 2
// cart.addItem('ult_small')
// cart.addItem('ult_small')
// cart.addItem('ult_large')
// cart.addItem('ult_large')
// cart.addItem('ult_large')
// cart.addItem('ult_large')

// SCENARIO 3
// cart.addItem('ult_small')
// cart.addItem('ult_medium')
// cart.addItem('ult_medium')

// SCENARIO 4
// cart.addItem('ult_small')
// cart.addItem('1gb', 'I<3AMAYSIM')

cart.getTotalPrice()