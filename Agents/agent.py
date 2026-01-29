from smolagents import tool 
# import packages that are used in our tools
import requests
from bs4 import BeautifulSoup
import json

@tool
def get_hugging_face_top_daily_paper() -> str:
    """
    This is a tool that returns the most upvoted paper on Hugging Face daily papers.
    It returns the title of the paper
    """
    try:
      url = "<https://huggingface.co/papers>"
      response = requests.get(url)
      response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
      soup = BeautifulSoup(response.content, "html.parser")

      # Extract the title element from the JSON-like data in the "data-props" attribute
      containers = soup.find_all('div', class_='SVELTE_HYDRATER contents')
      top_paper = ""

      for container in containers:
          data_props = container.get('data-props', '')
          if data_props:
              try:
                  # Parse the JSON-like string
                  json_data = json.loads(data_props.replace('&quot;', '"'))
                  if 'dailyPapers' in json_data:
                      top_paper = json_data['dailyPapers'][0]['title']
              except json.JSONDecodeError:
                  continue

      return top_paper
    except requests.exceptions.RequestException as e:
      print(f"Error occurred while fetching the HTML: {e}")
      return None