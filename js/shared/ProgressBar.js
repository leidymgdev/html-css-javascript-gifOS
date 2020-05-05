class ProgressBar {
  /**
   *Creates an instance of ProgressBar.
   * @memberof ProgressBar
   */
  constructor() {
    this.id = null;
    this.started = null;
    this.index = 0;
    this.element = null;
    this.classInProgress = null;
  }

  /**
   * Dynamically build a progress bar
   * @param {string} id - Id of the tag where the progress bar will be added.
   * @param {string} idClassName - Class that contains the height and width of the progress bar.
   * @param {number} spanQuantity - Number of spans the progress bar will have.
   * @param {string} classNameInProgress - Class containing the color to be changed while the progress bar is running.
   */
  build = (id, idClassName, spanQuantity, classNameInProgress) => {
    let span = '';

    for (let i = 0; i < spanQuantity; i++) {
      span += "<span class='span-progress empty-progress-bar'></span>";
    }

    let progressBarSection = document.createElement('div');
    progressBarSection.className = `progress ${idClassName}`;
    progressBarSection.innerHTML = span;

    document.getElementById(id).appendChild(progressBarSection);

    this.element = document.querySelectorAll(`#${id} .span-progress`);
    this.classInProgress = classNameInProgress;
    this.id = id;
  };

  /**
   * Start the progress bar knowing the total duration time.
   * @param {number} timeElapsed
   */
  start = (timeElapsed) => {
    let timePB = timeElapsed / this.element.length;
    this.started = setInterval(this.run, timePB);
  };

  /**
   * Start the progress bar WHITOUT knowing the total duration time.
   * Loop progress bar.
   */
  startLoop = () => {
    this.reset();
    let index = 0;

    const runLoop = () => {
      if (index >= this.element.length - 1) {
        index = 0;
        this.reset();
        clearInterval(this.started);
        this.started = setInterval(runLoop, 10);
      } else {
        index = Math.floor(this.index / (100 / this.element.length));
        this.index++;
        this.element[index].classList.add(this.classInProgress);
      }
    };

    this.started = setInterval(runLoop, 10);
  };

  /**
   * Run the progress bar and add a class that changes the background-color of the element.
   */
  run = () => {
    this.element[this.index].classList.add(this.classInProgress);
    this.index++;
    if (this.index >= this.element.length) {
      this.index = 0;
      clearInterval(this.started);
    }
  };

  /**
   * Reset the progress bar and drop a class that restores the element's default background color.
   */
  reset = () => {
    this.index = 0;
    this.element.forEach((element) => {
      element.classList.remove(this.classInProgress);
    });
  };

  delete = () => {
    let id = document.getElementById(this.id);
    id.removeChild(id.lastElementChild);
  };
}
