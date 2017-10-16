package org.eclipse.winery.repository.ui.test.artifacttypetest;

import org.eclipse.winery.repository.ui.test.TestSettings;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * this test deletes an ArtifactType
 */

public class UITestDeleteArtifact extends TestSettings {
	
	@Test
	//Delete artifact on main page
	public void testDeleteArtifact() throws Exception {

		driver.get("http://localhost:4200/#/other");
		driver.findElement(By.xpath("//a[@class='btn btn-default'][contains(text(), 'Artifact Types')]")).click();
		driver.findElement(By.xpath("//div[@class='entityContainer artifactType']//div[@class='center']//div[@class='informationContainer']//div[@class='name'][contains(text(), 'Hallo')]//a[@class='deleteButton']")).click();

		WebElement element = driver.findElement(By.xpath("//button[@class='btn btn-primary']"));
		element.click();
		Assert.assertTrue("Delete Artifact Type successful", element.isEnabled());

	}
}
