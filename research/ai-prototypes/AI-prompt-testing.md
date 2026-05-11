# MemeBro Prototype Report

The following experiment tests AI-injected meme generation using the swapping faces method into a popular meme template. Just wanted to get this out and running so I used a Replicate Model which is an API model that can access multiple AI models. Other than the face swap method a cartoon styling is also included just to compare the difference in injection. Wanted to get an idea of the quality of image we can get by using a random person face and swapping them onto these popular templates. The results were analyzed and I included a gaurdrail case to ensure PG-13 and that the performance meets the given criteria.


This prototype uses Replicate as the AI platform and runs two main flows:

1. `lucataco/faceswap` swaps a source face into a popular meme template.
2. `catacolabs/cartoonify` optionally cartoonizes the result for a second visual style.


## Why Replicate?
It is a cloud platform that hosts thousands of pre-trained models. Meaning we can run them using the API. Specifically chose 2 models to test AI injection methods, either the face swap or the cartoonify.

## API Key
Go on replicate.com and grab your Replicate API Token. And put on the terminal; REPLICATE_API_TOKEN=insert_your_token npm run test:meme

## How Does It Work?
Everything runs through a script called `test-meme.js`. It handles three big jobs:

### Step 1: The Face Swap
We use an AI tool called **Replicate** to handle the heavy lifting. It takes a photo of a person and a meme template, then digitally "swaps" the face in. We chose a model that’s well-supported so we didn't have to reinvent the wheel.

### Step 2: Adding the Classic Captions
Once the AI finishes the swap, we use a tool called `node-canvas` to draw the text. This is how we get that classic "Impact" font look you see on every viral meme, perfectly placed at the top and bottom.

### Step 3: Tracking the Bill
By using the specfic model with Replicate, I think its called lucataco/faceswap and the cartoonify model called catacolabs/cartoonify. We have an idea of how much it cost to generate a meme. As of right now its **0.002 per meme** 


## 3. The Test Results
We ran the script through classic templates like "Drake Hotline Bling" and "Distracted Boyfriend." Here’s what we found:

* **Speed**: It takes about **30 to 40 seconds** to go from a blank template to a finished meme. 
* **Safety First**: We tried to "trick" the AI into making a mean-spirited meme as a test. The AI caught it and blocked the request immediately. This proves our "PG-13" rule is actually working.
* **The "Uncanny Valley"**: The memes look good, but sometimes the faces look a little "too perfect" or slightly mismatched with the lighting of the original meme. We’re calling this the "Uncanny Valley" effect, and we're looking into ways to fix it in the next update.
