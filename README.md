# AI Pix Explorer

AI Pix Explorer is an interactive textbook game. It teaches how large language models (LLMs) and AI agents work. It also shows where they fail.

You play a new research fellow at a fictional law library. The story lasts one working week, from Monday to Friday. In each chapter you read a short scene, read a textbook section, use a toy and answer a few quiz questions.

The game runs in a web browser. It does not need an account or an internet connection to play. It does not collect data.

## Contents

1. [Who this is for](#who-this-is-for)
2. [What you learn](#what-you-learn)
3. [How the game works](#how-the-game-works)
4. [What you need](#what-you-need)
5. [Start the game](#start-the-game)
6. [Save your progress](#save-your-progress)
7. [Know the limits](#know-the-limits)
8. [Project files](#project-files)
9. [Change the game](#change-the-game)
10. [Sources and honesty notes](#sources-and-honesty-notes)
11. [License](#license)

## Who this is for

The game is for a reader who:

- knows the basics of machine learning, such as classification, clustering and gradient descent
- learns best from pictures and hands-on activities
- wants the real mechanism and the real formulas, but does not need to follow every formula

A lawyer or legal researcher is the main reader. All legal examples are fictional.

## What you learn

The game has 15 chapters. They are grouped by day.

| Day | Chapter | Topic |
|---|---|---|
| Monday | First Day | The story and the main idea of the game |
| Monday | Machines That Learn | How a machine learns from examples |
| Tuesday | Chopping Words | Tokens: how text becomes numbers |
| Tuesday | Maps of Meaning | Embeddings: how meaning becomes coordinates |
| Tuesday | The Attention Party | Attention: how words look at other words |
| Wednesday | Fill in the Blank | Pretraining: how a model learns from text |
| Wednesday | Bigger Is Better? | Scaling: what changes when a model grows |
| Wednesday | Loaded Dice | Sampling: how a model picks the next word |
| Thursday | Good Manners | Tuning: how a model learns to follow instructions |
| Thursday | Show Your Work | Prompting and step-by-step reasoning |
| Thursday | Open Book | Retrieval-augmented generation (RAG) |
| Friday | Chef and Runner | AI agents: a model that uses tools |
| Friday | The Big Run | A 3D view of one agent job, one token at a time |
| Friday | Where It Breaks | The limits of AI for legal research |
| Friday | The Memo | A final job that uses all the ideas |

## How the game works

Each chapter has four parts:

1. **Story scene.** You talk with the cast and click objects in the scene.
2. **Textbook section.** You read a clear explanation with formulas. The text gives a citation for each fact it takes from a paper.
3. **Toy.** You change the settings of a small working model and see the result. There are more than 20 toys.
4. **Quiz check.** You answer a few questions to test your understanding.

The game also has these tools in the toolbox:

- a map, to go to any chapter you already opened
- the textbook, to re-read any section
- a history timeline
- a sticker book, to see the stickers you earned
- a glossary, to look up a term
- a settings window

### The cast

All characters are fictional.

| Character | Role |
|---|---|
| Dr. Quill | Your mentor. Explains the mechanism. |
| Pixel | A friendly AI with a screen for a head. |
| Whitlock | A senior partner who sets the stakes. |
| Dash | A runner. Stands for the software that runs the tools. |

### Analogies

The game explains each idea with an everyday comparison. For example, tokens are building bricks, the context window is a desk, and attention is a party. The analogies are not legal.

## What you need

- A current web browser, such as Safari, Chrome, Firefox or Edge.
- A screen of any size. The game works on a phone.
- (Optional) An internet connection. The game loads its fonts from Google Fonts. Without a connection, the browser uses other fonts and some labels can look different.

To build the game from the source files, you also need:

- Python 3.9 or later.

## Start the game

The game file is built from the source files in the `src` folder. Use these steps to build the game and open it.

1. Open a terminal in the project folder.
2. Run this command:

   ```bash
   python3 tools/build.py
   ```

   The command prints a line that starts with `built`.

3. Open the file `preview/index.html` in your browser.

   On a Mac, you can run this command:

   ```bash
   open preview/index.html
   ```

   You can also run `python3 tools/preview.py --open`. This command builds the game and opens it.

4. On the title screen, click **Start the adventure**. Type your name. Click **Start your first day**.

   To skip the story, click **Toy box and textbook**. This opens the toys and the textbook directly.

> **Note:** Do not open `ai-pix-explorer.html` directly in a browser. That file has no page header, because the publishing service adds one. Some browsers then show wrong symbols. Open `preview/index.html` instead.

## Save your progress

The game saves your progress in your browser. When you return, click **Continue** on the title screen to resume.

The save data stays on your device. The game does not send it anywhere.

> **Note:** A private browsing window can block saving. If this occurs, your progress is lost when you close the window.

To delete your progress, click **Menu**, then **Erase**. Click the button again when it asks you to confirm.

## Know the limits

- The toys are simple models. They show how an idea works. They are not real AI systems.
- The numbers in the 3D run, the dice rolls, the scaling charts and the Limits chapter are invented. The game labels them as simulated or illustrative.
- The game uses a small, hand-made tokenizer and a small search method. Real systems use larger and more complex methods.
- The game explains general ideas. It does not give legal advice.

## Project files

| Path | Content |
|---|---|
| `src/` | The source files. Edit these files. |
| `src/css/` | The styles for the game. |
| `src/js/` | The game engine, the artwork code, the toys and one story file for each chapter. |
| `src/template.html` | The page template. |
| `tools/build.py` | Joins the source files into one HTML file. |
| `tools/check.py` | Plays every chapter in a hidden browser and takes screenshots. |
| `tools/preview.py` | Builds the game and opens it. |
| `ai-pix-explorer.html` | The built game. Do not edit this file. |
| `docs/paper-notes.md` | Facts from the cited papers, with their locations. |
| `legacy/` | The first version of the game, with tabs. |

The folders `preview/` and `shots/` are made by the tools. Git does not track them.

## Change the game

1. Edit the files in `src/`. Do not edit `ai-pix-explorer.html` by hand.
2. Run `python3 tools/build.py`. The last line must be `JS syntax: OK`.
   - The syntax check uses a tool that exists only on macOS. On other systems, the build skips the check and prints a message.
3. (Optional) Run the automatic test:

   ```bash
   pip install playwright
   python3 -m playwright install chromium
   python3 tools/check.py
   ```

   The test plays every chapter at a desktop width and at a phone width. It must print `ALL GOOD`. It saves screenshots in `shots/`.

### Rules for the build

- The game stays in one self-contained HTML file. All CSS and JavaScript are inline.
- The game uses no JavaScript libraries. The artwork, the sound and the 3D scene are written by hand.
- The game works at a phone width of 400 pixels, with no sideways scrolling.
- The game respects the "reduce motion" setting of the device.

## Sources and honesty notes

The textbook sections use 23 research papers and articles. The game cites each one in APA style. The full list of citations is in the game. The papers are not in this repository, because their authors and publishers own them.

The game labels all fictional material:

- The cases, memos, states and citations are invented.
- The invented citations are never shown as real.

If you find a mistake in a fact, a number or a citation, report it.

## License

This project uses two licenses.

- The **software** uses the [MIT License](LICENSE).
- The **creative content** uses the [Creative Commons Attribution 4.0 International license](https://creativecommons.org/licenses/by/4.0/). This covers the story, the textbook text, the characters and the artwork.

The file [LICENSE](LICENSE) has the full text of both licenses and a list of what each one covers. The licenses do not cover the cited papers or the fonts.
