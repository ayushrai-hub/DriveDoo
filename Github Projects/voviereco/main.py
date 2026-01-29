import speech_recognition as sr

def takeCommand():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = r.listen(source)

    try:
        statement = r.recognize_google(audio, language='en-in')
        print(f"user said: {statement}\n")

    except Exception as e:
        # speak("Sorry, please say that again")
        print('Sorry, please say that again')
        return "None"
    return statement


if __name__ == '__main__':
    statement = takeCommand().lower()
    print('detecting.....')
    print(statement)
