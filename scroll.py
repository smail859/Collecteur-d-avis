from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, ElementClickInterceptedException
from selenium.webdriver.common.action_chains import ActionChains

import time

# 🔧 Configuration du WebDriver
def configure_driver():
    chrome_options = Options()
    return webdriver.Chrome(service=Service(), options=chrome_options)

# URL Google Maps
url = "https://www.google.fr/maps/place/Startloc/@47.7333204,7.2848431,16z/data=!3m1!4b1!4m6!3m5!1s0x479184d4eff4c4d7:0x7899f13a20c78918!8m2!3d47.7333168!4d7.2874127!16s%2Fg%2F11swvgqkls?entry=ttu&g_ep=EgoyMDI1MDIxMi4wIKXMDSoASAFQAw%3D%3D"

# 🚀 Lancement du driver
driver = configure_driver()
driver.get(url)
time.sleep(2)

try:
    # ✅ Gestion de la fenêtre de consentement Google
    try:
        consent_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[.//span[contains(text(), 'Tout accepter')]]"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", consent_button)
        time.sleep(1)
        consent_button.click()
        print("✅ Consentement Google accepté !")
        time.sleep(2)
    except TimeoutException:
        print("✅ Aucun consentement Google à gérer.")

    # ✅ Clique sur l'onglet "Avis"
    try:
        avis_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@aria-label, 'avis')]"))
        )
        avis_button.click()
        print("✅ Onglet 'Avis' ouvert !")
        time.sleep(5)
    except Exception as e:
        print("❌ Impossible de cliquer sur 'Avis' :", e)

    # ✅ Clic sur le bouton "Plus d'avis"
    try:
        more_reviews_button = driver.find_element(By.XPATH, "//button[contains(@aria-label, \"Plus d'avis\")]")
        time.sleep(2)
        more_reviews_button.click()
        print("✅ Bouton 'Plus d'avis' cliqué !")
        time.sleep(1)
    except Exception as e:
        print(f"⏳ Pas de bouton 'Plus d'avis' trouvé, fin du chargement. Erreur : {e}")

    # Nombre maximal de tentatives de scroll
    MAX_SCROLLS = 10
    scroll_count = 0

    while scroll_count < MAX_SCROLLS:
        all_reviews = driver.find_elements(By.CLASS_NAME, "MyEned")  # Sélection des avis actuels
        
        if all_reviews:
            last_review = all_reviews[-1]  # Dernier avis visible
            time.sleep(2)
            # Scroller vers le dernier avis visible (avec un léger déplacement)
            ActionChains(driver).move_to_element(last_review).perform()
            driver.execute_script("arguments[0].scrollIntoView({block: 'end', inline: 'nearest'});", last_review)
            
            time.sleep(3)  # Attente pour charger de nouveaux avis
            # 🔽 Dernier scroll pour s'assurer d'être tout en bas
            driver.execute_script("window.scrollBy(0, 500);")  # Force un décalage de 500px en bas
            time.sleep(3)

            # 🔽 Encore un dernier coup pour être sûr
            driver.execute_script("window.scrollBy(0, 500);")
            time.sleep(3)

            # Vérifier si de nouveaux avis sont apparus
            new_all_reviews = driver.find_elements(By.CLASS_NAME, "MyEned")
            if len(new_all_reviews) > len(all_reviews):
                print(f" Nouveaux avis détectés ({len(new_all_reviews) - len(all_reviews)})")
                scroll_count += 1
            else:
                print("⚠️ Aucun nouvel avis détecté après le scroll.")             
        else:
            print("Aucun avis trouvé, arrêt du scroll.")
            break
finally:
    driver.quit()
