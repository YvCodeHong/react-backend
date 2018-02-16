/**
 * A template function for HTML main page rendering
 */
export default ({ data, markup }) => {
    return `<!doctype html>
<html>
<head>
  <script>var data = ${JSON.stringify(data)}</script>
</head>
<body>
	<div id="root">${markup}</div>
	<script src="/js/client.js" async></script>
</body>
</html>`
}