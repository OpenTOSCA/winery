package org.eclipse.winery.repository.ui.test;

import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;

public class UITestBaobab extends TestSettings {

	@Test
	public void baobabtest() throws Exception {
		driver.get("http://localhost:4200/#/nodetypes");
		driver.findElement(By.xpath("//div[@class='entityContainer nodeType']//div[@class='center']//div[contains(text(), baobab)]")).click();
		driver.findElement(By.id("localname")).click();
		driver.findElement(By.id("renamePropertyInput")).sendKeys("RenameBaobab");
		driver.findElement(By.xpath("//button[@class='btn btn-primary btn-xs'][contains(text(), 'Save')]")).click();
		Assert.assertTrue(true);
	}
}

