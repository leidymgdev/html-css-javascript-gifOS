class Clipboard {
  /**
   * Creates an instance of Clipboard.
   * And execute securityAndPermissionsClipboard function to grant security and permissions.
   * @memberof Clipboard
   */
  constructor() {
    this.securityAndPermissionsClipboard();
  }

  /**
   * Grantsecurity and permissions.
   */
  securityAndPermissionsClipboard = () => {
    navigator.permissions
      .query({
        name: 'clipboard-write'
      })
      .then((permissionStatus) => {
        // Will be 'granted', 'denied' or 'prompt':
        if (permissionStatus.state !== 'granted') {
          console.error('Failed to granted security and permissions.');
        }

        // Listen for changes to the permission state
        permissionStatus.onchange = () => {};
      })
      .catch((err) => {
        console.error(`Something went wrong. ${err}`);
      });
  };

  /**
   * Write content text to the clipboard
   * Taken from https://googlechrome.github.io/samples/async-clipboard/
   * and https://developers.google.com/web/updates/2018/03/clipboardapi
   * @param {string} text
   */
  copy = async (text) => {
    // Detecting Support and fallback
    if (navigator.clipboard) {
      // Turn the feature on.
      navigator.clipboard
        .writeText(text)
        .then(() => {
          //console.log(`Text copied to clipboard. ${text}`);
        })
        .catch((err) => {
          console.error(`Failed to copy text. ${err}`);
        });
    } else {
      // Use execCommand or leave the feature off
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.value = text;
      input.select();

      const result = document.execCommand('copy');
      if (result === 'unsuccessful') {
        console.error(`Failed to copy text. ${result}`);
      }
    }
  };
}
