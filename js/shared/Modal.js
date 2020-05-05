class Modal {
  /**
   *Creates an instance of Modal.
   * @memberof Modal
   */
  constructor() {
    this.idModal = null;
  }

  /**
   * Build a modal by receiving an id, title,
   * content and callback function.
   * @param {string} id
   * @param {string} title
   * @param {string} content
   * @param {function()} callbackFunction - It's optional.
   */
  open = (id, title, content, typeOfIcon, callbackFunction) => {
    let icon = this.getIcon(typeOfIcon);

    const modalContent = `<div class="modal-content">
      <div class="modal-header gradient">
        <span>${title}</span>
        <span class="close" onclick="closeModal(); ${
          typeof callbackFunction == 'function' ? callbackFunction.name + '();' : ''
        }">&times;</span>
      </div>
      <div class="modal-body">
        <div>
          <img src='../../../assets/icons/${icon}' alt='icon-modal' title='icon-modal' class="icon-modal" />
        </div>
        <div>
          <p>${content}</p>
        </div>
      </div>
      <div class="modal-footer">
        <a class="btn-primary btn-lg" onclick="closeModal(); ${
          typeof callbackFunction == 'function' ? callbackFunction.name + '();' : ''
        }">Aceptar</a>
      </div>
    </div>`;

    let modalSection = document.createElement('section');
    modalSection.id = id;
    modalSection.className = 'modal';
    modalSection.innerHTML = modalContent;

    document.body.appendChild(modalSection);

    this.idModal = document.getElementById(id);
  };

  close = () => {
    document.body.removeChild(this.idModal);
  };

  /**
   * Get icon name.
   * @param {string} typeOfIcon
   * @returns
   */
  getIcon = (typeOfIcon) => {
    let icon = '';
    switch (typeOfIcon) {
      case 'sucess_icon':
        icon = 'success-icon.png';
        break;
      case 'warning_icon':
        icon = 'warning-icon.png';
        break;
      case 'error_icon':
        icon = 'error-icon.png';
        break;
    }
    return icon;
  };
}

const modal = new Modal();

const closeModal = () => {
  modal.close();
};
