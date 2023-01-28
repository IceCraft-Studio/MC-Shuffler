document.getElementById('generate-pack').addEventListener('submit',(eventData) => {
    eventData.preventDefault();
    const formData = new FormData(eventData.target);
    console.log(formData);
    //fetch('/generate-pack',{
    //    method: 'POST',
    //    body: formData
    //})
})