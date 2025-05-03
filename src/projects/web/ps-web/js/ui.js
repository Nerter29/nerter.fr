

export function setUpCheckBoxes(checkboxes){
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            checkboxes.forEach(cb => {
              if (cb !== checkbox) cb.checked = false;
            });
          }
        });
      });
      checkboxes.forEach(cb => {
          cb.checked = false;
        });
    checkboxes[4].checked = true;
}

export function getBoxIndex(checkboxes) {
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            return i;
        }
    }
    return 4; //return square if no one is checked
}

export function setUpInputs(inputs, baseValues){
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = baseValues[i];
  }
}
