package org.eclipse.winery.repository.ui.test.artifacttypetest;

import org.eclipse.winery.repository.ui.test.TestSettings;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * this test adds an ArtifactType with a short documentation
 */

public class UITestAddOtherArtifact extends TestSettings {
	
	@Test
	public void testAddOtherArtifact() throws Exception {
		//Add artifact type
		driver.get("http://localhost:4200/#/other");
		driver.findElement(By.xpath("//a[@class='btn btn-default'][contains(text(), 'Artifact Types')]")).click();
		driver.findElement(By.id("sectionsAddNewBtn")).click();
		driver.findElement(By.id("componentName")).sendKeys("ArtifactTypeTest");
		driver.findElement(By.id("namespace")).sendKeys("http://plain.winery.opentosca.org/capabilitytypes");
		driver.findElement(By.xpath("//button[@class='btn btn-primary'][contains(text(), 'Add')]")).click();
		driver.findElement(By.xpath("//div[@class='subMenu']//a//div[@class='center'][contains(text(), 'Documentation')]")).click();

		driver.findElement(By.xpath("//div[@class='subMenu']//a[@class='styledTabMenuButton styledTabMenuButton2ndlevel']//div[contains(text(), 'Documentation')]")).click();
		WebElement element = driver.findElement(By.xpath("//div[@class='documentationField']//textarea[@class='texDoc ng-untouched ng-pristine ng-valid']"));
		element.click();
		element.sendKeys("Hallo, Ich bin eine Dokumentation!");
		WebElement element2 = driver.findElement(By.xpath("//div[@class='floatButton']//button[@class='btn btn-primary']"));
		element2.click();
		Assert.assertFalse("Can't add same NodeName", element2.isEnabled());
	}
}
