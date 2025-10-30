--Readme document for Ethan Votran, evotran@uci.edu

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10 base + 1/1 extra credit = 11/10
- 3/3 Summarizing tweets
- 4/4 Identifying the most popular activities
- 3/3 Adding a text search interface
- +1 Bonus: Single dynamic Vega-Lite chart toggle (points↔means)

2. How long, in hours, did it take you to complete this assignment?

~3 hours total (implementation + testing)

3. What online resources did you consult when completing this assignment? (list sites like StackOverflow or specific URLs for tutorials; describe queries to Generative AI or use of AI-based code completion)

- Assignment starter repo and scaffolding
  - https://github.com/uci-inf-133/a2-tweets-ethanvotran20.git
- Libraries (via CDN)
  - Vega, Vega-Lite, Vega-Embed
  - Math.js
- MDN references for JavaScript/RegExp and Date formatting
- https://www.w3schools.com/typescript/
- AI assistance with coding structure and syntax through Cursor

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

None.

5. Is there anything special we need to know in order to run your code?

- Requires global tools:
  - TypeScript (tsc) and Live Server
- From project root:
  - tsc --project tsconfig.json --watch
  - live-server
- Open pages:
  - index.html (About)
  - activities.html (Activities)
  - descriptions.html (Descriptions)
- Notes:
  - `ts/tweet.ts` transpiles to `js/tweet.js`. Do not edit `js/tweet.js` directly.
  - Bonus: Activities page uses a single dynamic Vega-Lite chart; the button toggles between raw points and mean aggregation.
  - Make sure to extract zip file before opening and testing files.

