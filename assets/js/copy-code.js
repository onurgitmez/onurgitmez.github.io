// Add a "Copy" button to each code block
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
    var button = document.createElement('button');
    button.className = 'copy-code-button';
    button.textContent = 'Copy';

    var pre = codeBlock.parentNode; // Get the parent <pre> element
    pre.style.position = 'relative'; // Make sure the parent is positioned for the button placement

    // Insert the button in a way that it's positioned over the code block
    pre.insertBefore(button, codeBlock);

    button.addEventListener('click', function () {
      var text = codeBlock.innerText;
      navigator.clipboard.writeText(text).then(function () {
        button.textContent = 'Copied!';
        setTimeout(function () {
          button.textContent = 'Copy';
        }, 2000);
      }).catch(function () {
        console.error('Failed to copy text.');
      });
    });
  });
});
