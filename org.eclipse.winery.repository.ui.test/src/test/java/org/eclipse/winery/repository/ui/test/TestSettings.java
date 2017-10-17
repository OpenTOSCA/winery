package org.eclipse.winery.repository.ui.test;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import static java.util.concurrent.TimeUnit.SECONDS;

public class TestSettings {
	
	protected static FirefoxDriver driver;

	@BeforeClass
	public static void init() throws Exception {
		//System.setProperty("webdriver.gecko.driver", "C:/Users/Franzi/Documents/geckodriver.exe");
		System.setProperty("webdriver.gecko.driver", "C:/Users/asst/Desktop/geckodriver.exe");
		DesiredCapabilities capabilities = DesiredCapabilities.firefox();
		capabilities.setCapability("marionette", true);
		
		driver = new FirefoxDriver();
		driver.manage().timeouts().implicitlyWait(10, SECONDS);
	}

	@AfterClass
	public static void shutdown() throws Exception {
		driver.close();
	}
	
}
