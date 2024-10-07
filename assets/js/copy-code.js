// Add a "Copy" button to each code block
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
    var button = document.createElement('button');
    button.className = 'copy-code-button';
    button.textContent = 'Copy';

    codeBlock.parentNode.insertBefore(button, codeBlock);

    button.addEventListener('click', function () {
      var text = codeBlock.innerText;
      navigator.clipboard.writeText(text).then(function () {
        button.textContent = 'Copied!';
        setTimeout(function () {
          button.textContent = 'Copy';
        }, 2000);
      });
    });
  });
});
