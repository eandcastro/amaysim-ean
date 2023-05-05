import { ShoppingCart } from '../amaysim-test.mjs';
import { expect } from 'chai';

describe('Shopping Cart', function () {
  let cart
  beforeEach(function () {
    cart = new ShoppingCart()
  })

  it('should throw invalid input data if productCode is empty or null', async function () {
    try {
      await cart.addItem('')
    } catch (error) {
      expect(error.cause).to.eql('Input data is not a string')
    }
  });

  it('should throw invalid input data if promoCode contains not allowed special characters', async function () {
    try {
      await cart.addItem('ult_small', 'I<3AMAYSIM!!')
    } catch (error) {
      expect(error.cause).to.eql('Input data contains special characters that are not allowed')
    }
  });

  it('should throw invalid input data if productCode contains not allowed special characters', async function () {
    try {
      await cart.addItem('ult_small!#', 'I<3AMAYSIM')
    } catch (error) {
      expect(error.cause).to.eql('Input data contains special characters that are not allowed')
    }
  });

  it('should throw invalid input data if productCode is not a string', async function () {
    try {
      await cart.addItem(123, 'I<3AMAYSIM')
    } catch (error) {
      expect(error.cause).to.eql('Input data is not a string')
    }
  });

  it('should throw invalid product code', async function () {
    try {
      await cart.addItem('ult_smalla', 'I<3AMAYSIM')
    } catch (error) {
      expect(error.cause).to.eql('Product code does not exists')
    }
  });

  it('should throw invalid promo code', async function () {
    try {
      await cart.addItem('ult_small', 'I<3AMAYSIMS')
    } catch (error) {
      expect(error.cause).to.eql('Promo code does not exists')
    }
  });

  it('should give 3 for 2 deal on Unlimited 1GB Sims', async function () {
    await cart.addItem('ult_small')
    await cart.addItem('ult_small')
    await cart.addItem('ult_small')
    await cart.addItem('ult_large')
    await cart.getTotalPrice()

    expect(parseFloat(cart.totalPrice).toFixed(2)).to.eql('94.70')
  });

  it('should drop the 5gb price to 39.9 if user buys more than 3', async function () {
    await cart.addItem('ult_small')
    await cart.addItem('ult_small')
    await cart.addItem('ult_large')
    await cart.addItem('ult_large')
    await cart.addItem('ult_large')
    await cart.addItem('ult_large')
    await cart.getTotalPrice()

    expect(parseFloat(cart.totalPrice).toFixed(2)).to.eql('209.40')
  });

  it('should include free 1gb data pack for every unli 2gb product', async function () {
    await cart.addItem('ult_small')
    await cart.addItem('ult_medium')
    await cart.addItem('ult_medium')
    await cart.getTotalPrice()

    expect(parseFloat(cart.totalPrice).toFixed(2)).to.eql('84.70')
  });

  it('should receive 10% discount', async function () {
    await cart.addItem('ult_small')
    await cart.addItem('1gb', 'I<3AMAYSIM')
    await cart.getTotalPrice()

    expect(parseFloat(cart.totalPrice).toFixed(2)).to.equal('31.32')
  });
})