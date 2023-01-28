console.log('test')

document.getElementById('pack-form').addEventListener('submit',(eventData) => {
    console.log(';lets prevent data')
    eventData.preventDefault();
    const formData = new FormData(eventData.target);
    console.log(formData);
    //fetch('/generate-pack',{
    //    method: 'POST',
    //    body: formData
    //})
})