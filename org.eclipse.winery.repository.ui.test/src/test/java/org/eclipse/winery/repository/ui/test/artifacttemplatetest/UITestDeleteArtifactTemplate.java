package org.eclipse.winery.repository.ui.test.artifacttemplatetest;

import org.eclipse.winery.repository.ui.test.TestSettings;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * this test deletes an ArtifactTemplate
 */

public class UITestDeleteArtifactTemplate extends TestSettings {

	@Test
	//Delete artifact on main page
	public void testDeleteArtifactTemplate() throws Exception {

		driver.get("http://localhost:4200/#/other");
		driver.findElement(By.xpath("//a[@class='btn btn-default'][contains(text(), 'Artifact Templates')]")).click();
		driver.findElement(By.xpath("//a[@class='deleteButton']")).click();

		WebElement element = driver.findElement(By.xpath("//button[@class='btn btn-primary']"));
		element.click();
		Assert.assertTrue("Delete Artifact Type successful", element.isEnabled());
	}
}
