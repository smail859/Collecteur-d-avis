from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

# 🔧 Configuration de Selenium pour utiliser Chrome ouvert
chrome_options = Options()
chrome_options.debugger_address = "127.0.0.1:9222"

# 🚀 Démarrer Selenium
driver = webdriver.Chrome(options=chrome_options)

# 📌 URL Google Maps (remplace par l'URL cible)
url = "https://www.google.com/maps/place/Startloc/@47.7333168,7.2874127,16z/data=!3m1!4b1!4m6!3m5!1s0x479184d4eff4c4d7:0x7899f13a20c78918!8m2!3d47.7333168!4d7.2874127!16s%2Fg%2F11swvgqkls?entry=ttu&g_ep=EgoyMDI1MDIxNy4wIKXMDSoASAFQAw%3D%3D"
driver.get(url)

# 🕒 Attendre le chargement initial de la page
time.sleep(5)

# 📌 **Clique sur l'onglet "Avis"**
try:
    all_buttons = driver.find_elements(By.TAG_NAME, "button")
    for button in all_buttons:
        if "avis" in button.get_attribute("aria-label").lower():
            print("✅ Bouton Avis trouvé, on clique dessus !")
            button.click()
            time.sleep(5)
            break
    else:
        print("⚠️ Aucun bouton 'Avis' trouvé.")
except Exception as e:
    print("❌ Erreur en cliquant sur le bouton Avis :", e)

# 📌 **Clique sur "Plus d'avis" plusieurs fois pour charger plus de données**
for _ in range(10):  # Augmente cette valeur pour charger plus d'avis
    try:
        more_reviews_button = driver.find_element(By.CLASS_NAME, "M77dve")  # Bouton "Plus d'avis"
        if more_reviews_button.is_displayed():
            more_reviews_button.click()
            print("✅ Chargement de plus d'avis...")
            time.sleep(3)
    except:
        print("⏳ Pas de bouton 'Plus d'avis' trouvé ou plus d'avis à charger.")
        break  # Sort de la boucle si plus de bouton

# 📌 **Scroll pour charger les avis supplémentaires**
try:
    review_section = driver.find_element(By.CLASS_NAME, "m6QErb")
    for _ in range(20):  # Augmente la valeur pour scroller plus
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", review_section)
        time.sleep(2)
    print("✅ Tous les avis sont chargés !")
except Exception as e:
    print("❌ Erreur lors du scroll :", e)

# 📌 **Récupération des avis**
reviews = driver.find_elements(By.CLASS_NAME, "wiI7pd")  # Texte des avis
stars = driver.find_elements(By.CLASS_NAME, "kvMYJc")  # Notes en étoiles
authors = driver.find_elements(By.CLASS_NAME, "d4r55")  # Nom de l'auteur
dates = driver.find_elements(By.CLASS_NAME, "rsqaWe")  # Date de l'avis
likes = driver.find_elements(By.CLASS_NAME, "GBkF3d")  # Nombre de "J'aime"
photos = driver.find_elements(By.CLASS_NAME, "KtCyie")  # Présence de photos
owner_responses = driver.find_elements(By.CLASS_NAME, "CDe7pd")  # Réponses du propriétaire

# 📌 **Afficher toutes les informations des avis**
for i in range(len(reviews)):
    try:
        author = authors[i].text if i < len(authors) else "Inconnu"
        review_text = reviews[i].text if i < len(reviews) else "Pas de texte"
        star_rating = stars[i].get_attribute("aria-label") if i < len(stars) else "Note inconnue"
        review_date = dates[i].text if i < len(dates) else "Date inconnue"
        review_likes = likes[i].text if i < len(likes) else "0"
        has_photos = "Oui" if i < len(photos) else "Non"
        owner_response = owner_responses[i].text if i < len(owner_responses) else "Pas de réponse"

        print(f"👤 Auteur : {author}")
        print(f"⭐ Note : {star_rating}")
        print(f"📅 Date : {review_date}")
        print(f"👍 Likes : {review_likes}")
        print(f"📷 Photos incluses : {has_photos}")
        print(f"📝 Avis : {review_text}")
        print(f"🏢 Réponse du propriétaire : {owner_response}\n")
        print("=" * 80)  # Séparation entre chaque avis

    except Exception as e:
        print(f"⚠️ Erreur lors de la récupération d'un avis : {e}")

# 🚀 Fermer Selenium (optionnel)
# driver.quit()
