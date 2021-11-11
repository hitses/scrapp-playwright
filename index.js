// @ts-check

const { chromium } = require('playwright')

const shops = [
  {
    vendor: 'Microsoft',
    hasSchema: false,
    url: 'https://www.xbox.com/es-Es/configure/8WJ714N3RBTL',
    checkStock: async ({ page }) => {
      const content = await page.textContent('[aria-label="Finalizar la compra del pack"]')
      return content.includes('Sin existencias') === false
    }
  },
  {
    vendor: 'Amazon',
    hasSchema: false,
    url: 'https://www.amazon.es/dp/B08H93ZRLL/ref=cm_sw_r_cp_apa_glt_i_91H0Z62WVDRT6FMW033Z',
    checkStock: async ({ page }) => {
      const addToCartButton = await page.$$('#add-to-cart-button')
      return addToCartButton.lenght > 0
    }
  },
  {
    vendor: 'FNac',
    hasSchema: true,
    url: 'https://www.fnac.es/Consola-Xbox-Series-X-1TB-Negro-Videoconsola-Consola/a7732201',
    checkStock: async ({ page }) => {
      const notAvailableIcon = await page.$$('.f-buyBox-availabilityStatus-unavailable')
      return notAvailableIcon.lenght === 0
    }
  },
  // Disabled for now because it's not working properly
  // {
  //   vendor: 'El Corte Inglés',
  //   hasSchema: false,
  //   url: 'https://www.elcorteingles.es/videojuegos/A37047078-xbox-series-x/',
  //   checkStock: async ({ page }) => {
  //     const content = await page.textContent('#js_add_to_cart_desktop')
  //     return content.includes('Agotado temporalmente') === false
  //   }
  // },
  // Disabled for now because it's not working properly
  // {
  //   vendor: 'MediaMarkt',
  //   hasSchema: true,
  //   url: 'https://www.mediamarkt.es/es/product/_consola-microsoft-xbox-series-x-1-tb-ssd-negro-1487615.html',
  //   checkStock: async ({ page }) => {
  //     const content = await page.textContent('[data-test="pdp-product-not-available"]')
  //     return content.includes('Este artículo no está disponible actualmente.') === false
  //   }
  // },
  {
    vendor: 'Game',
    hasSchema: false,
    url: 'https://www.game.es/OFERTAS/PACK/PACKS/XBOX-SERIES-X-CONTROLLER-XBOX/P03362',
    checkStock: async ({ page }) => {
      const content = await page.textContent('.product-quick-actions')
      return content.includes('Producto no disponible') === false
    }
  }
]

;(async () => {
  const browser = await chromium.launch()

  for (const shop of shops) {
    const { checkStock, vendor, url } = shop
    const page = await browser.newPage()
    await page.goto(url)
    const hasStock = await checkStock({ page })
    console.log(`${vendor}: ${hasStock ? 'in stock' : 'out of stock'}`)
    await page.screenshot({ path: `screenshots/${vendor}.png` })
    await page.close()
  }

  await browser.close()
})()
