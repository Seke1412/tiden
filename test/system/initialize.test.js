import { init } from "../../ops.js"

describe(`init`, async () => {
  it(`should bootstrap a fully working project`, async () => {
    await init({
      name: `Tiden Example App`,
      description: `Use Tiden for a more flexible approach to building progressive web applications`,
      isTest: true,
    })

    await page.goto(`http://localhost:1107`)
    expect(await page.evaluate(() => document.title)).to.equal(
      `Tiden Example App`
    )

    await page.waitForFunction(() => {
      return !!document.body.textContent
    })

    expect(
      await page.evaluate(() => document.body.textContent.trim())
    ).to.equal(`Hurray! You're here.`)
  })
})
