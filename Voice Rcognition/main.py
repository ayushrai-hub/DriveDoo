import speech_recognition as sr
recognizer = sr.Recognizer()

def capture_voice_input():
    with sr.Microphone() as source:
        print("Listenirng...")
        audio = recognizer.listen(source)
    return audio

def convert_voice_to_text(audio):
    try:
        text = recognizer.recognize_google(audio)
        print("You said: " + text)
    except sr.UnknownValueError:
        text = ""
        print("Sorry, I didn't understand that.")
    except sr.RequestError as e:
        text = ""
        print("Error; {0}".format(e))
    return text


audio = capture_voice_input()
ext = convert_voice_to_text(audio)