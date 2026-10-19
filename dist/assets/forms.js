// Local preview interactions only. No personal information is stored or transmitted.
document.querySelectorAll('form').forEach(form=>{
 const steps=[...form.querySelectorAll('[data-form-step]')],submit=form.querySelector('[type=submit]');let current=0;
 const show=i=>{current=i;steps.forEach((s,n)=>s.hidden=n!==i);if(steps.length)submit.hidden=i!==steps.length-1;const heading=steps[i]?.querySelector('h2');if(heading){heading.tabIndex=-1;heading.focus()}};
 if(steps.length){submit.hidden=true;form.querySelector('.next-step')?.addEventListener('click',()=>{const inputs=[...steps[current].querySelectorAll('input,textarea,select')];const bad=inputs.find(x=>!x.checkValidity());if(bad){bad.reportValidity();return}show(current+1)});form.querySelector('.previous-step')?.addEventListener('click',()=>show(current-1));form.addEventListener('submit',e=>{if(current<steps.length-1){e.preventDefault();e.stopImmediatePropagation();form.querySelector('.next-step').click()}},true)}
 const qty=form.querySelector('[name=quantity]');if(qty){qty.min='1';qty.max='100';qty.value='1'}
 const date=form.querySelector('input[type=date]');if(date){const now=new Date();date.min=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')}
 form.querySelectorAll('[data-intent]').forEach(button=>button.addEventListener('click',()=>{form.querySelectorAll('[data-intent]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));form.querySelector('[name=intent]').value=button.dataset.intent;const area=form.querySelector('[name=area]');area.parentNode.firstChild.textContent=button.dataset.intent==='Selling'?'Property neighbourhood':'Preferred neighbourhood'}));
 const interest=new URLSearchParams(location.search).get('interest');if(interest){const message=form.querySelector('textarea');if(message)message.value='I would like to know more about '+interest+'.'}
});
