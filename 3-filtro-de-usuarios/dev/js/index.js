const mainDOMElement=document.getElementById('main')
const filterDOMElement=document.getElementById('filter')
let tagInFilter=[];
const getDataJson= async()=>{
    try{
        const res=await fetch('./data.json')
        const data= await res.json()
        console.log(data)
        paintCard(data)
    }catch(e){
        console.log(`ERROR ${e}`)
    }
}
//manera de recorrerlo si lo almacenamos dentro de una variable
// const dataJ= getDataJson();
// dataj.then(l=>console.log(l.data))
const paintCard=(data)=>{
    const fragment=document.createDocumentFragment();
    data.forEach(el=>{

        //CARD
        const card=document.createElement('DIV');
        card.classList.add('card');
        card.dataset.lenguages = el.languages;
        //CARD HEADER
        const cardHeader=document.createElement('DIV');
        cardHeader.classList.add('card__header');
        //agregamos cardheader dentro de card
        card.appendChild(cardHeader);

        const imageLogo=document.createElement('IMG');
        imageLogo.classList.add('card__image')
        imageLogo.src=el.logo
        cardHeader.appendChild(imageLogo)
        const h2=document.createElement('H2');
        h2.classList.add('card__title')
        h2.textContent=el.company;
        
        cardHeader.appendChild(h2);//agregamos el h2 a el cardheader
       
        //si es true lo que viene del json creamos los span
        if(el.new){
            const span=document.createElement('SPAN');
            span.classList.add('card__label');
            span.textContent='NEW!';
            cardHeader.appendChild(span)
        }
        if(el.featured){
            const spanDark=document.createElement('SPAN');
            spanDark.classList.add('card__label','card__label--dark');
            spanDark.textContent='FEATURED';
            cardHeader.appendChild(spanDark)
        }
        //FIN CARD HEADER
     
        // CARD BODY
        const cardBody=document.createElement('DIV');
        cardBody.classList.add('card__body')
        const p=document.createElement('P')
        p.classList.add('card__position')
        p.textContent=el.position;
        cardBody.appendChild(p)
        
        const cardInfo=document.createElement('DIV');
        cardInfo.classList.add('card__info');
        const spanPosted=document.createElement('SPAN');
        spanPosted.classList.add('card__job-info');
        spanPosted.textContent=el.postedAt;
        //agregamos dentro del card body el div que contiene info del trabajo span
        cardBody.appendChild(cardInfo);

        const spanContract=document.createElement('SPAN');
        spanContract.classList.add('card__job-info');
        spanContract.textContent=el.contract;

        const spanLocation=document.createElement('SPAN');
        spanLocation.classList.add('card__job-info');
        spanLocation.textContent=el.location

        //agregamos los span con info del trabajo del usuario dentro del div carinfo
        cardInfo.appendChild(spanPosted)
        cardInfo.appendChild(spanContract)
        cardInfo.appendChild(spanLocation)
        // FIN CARD BODY

        
        card.appendChild(cardBody)
        

        //CARD FOOTER
        const cardFooter=document.createElement('DIV');
        cardFooter.classList.add('card__footer');
        for(tag of el.languages){
            const spanLenguaje=document.createElement('SPAN');
            spanLenguaje.classList.add('card__tag');
            spanLenguaje.textContent=tag
            cardFooter.appendChild(spanLenguaje)
        }
        card.appendChild(cardFooter)
        fragment.appendChild(card)
    })
    mainDOMElement.appendChild(fragment);

}
getDataJson()

const createTag=(text)=>{
    const fragment=document.createDocumentFragment();
    const tag=document.createElement('DIV');
    tag.classList.add('tag','tag--whith-close');
    const tagTitle=document.createElement('DIV');
    tagTitle.classList.add('tag__title');
    tagTitle.textContent=text
    const tagClose=document.createElement('DIV');
    tagClose.classList.add('tag__close');
    const tagCloseImg=document.createElement('IMG');
    tagCloseImg.classList.add('tag__close-img')
    tagCloseImg.src='./assets/images/icon-remove.svg';

    tagClose.appendChild(tagCloseImg)
    
    tag.appendChild(tagTitle)
    tag.appendChild(tagClose)

    fragment.appendChild(tag)
    filterDOMElement.appendChild(fragment)
}
const checkFilter=()=>{
    const allCard=[...document.querySelectorAll('.card')];
    console.log(allCard)
    allCard.forEach(card=>card.classList.add('card--hide'))

    for(card of allCard){
        const lenguages=card.dataset.lenguages.split(',');
        //every Determina si todos los elementos en el array satisfacen una condición.
        //en este caso si el dataset de lenguages incluye o hay lo mismo que en el array tagInFilter
        //cada vulta de bucle devolvera true o false si se cumple la condicion o no
        //Y SI EL ARRAY ESTA COMPLETAMENTE VACIO DEVULVE TRUE
        const validation= tagInFilter.every(lenguage=>lenguages.includes(lenguage))
        // console.log(validation)
        validation && card.classList.remove('card--hide')
    }
    //SOLO HACE EL FILTRO DE ALGUNAs EN OTRAS NO ANDA Y NO SE PORQUE
    /*allTagInCard.forEach(tag=> {
        tagInFilter.includes(tag.textContent)?
            tag.parentElement.parentElement.style.display=''
            :
            tag.parentElement.parentElement.style.display='none'
     })*/
}

// FUNCION POARA REMOVER TODAS LAS TAG DEL FILTRO
const RemoveTag=()=>{
    const allFilterTags=[...document.querySelectorAll('.tag--whith-close')]
    // console.log(allFilterTags)
    allFilterTags.forEach(tag=>tag.remove())
}

// DELEGACION DE EVENTOS
mainDOMElement.addEventListener(('click'),e=>{
    // console.log()
    if(e.target.classList.contains('card__tag')){
        const tagInUse=tagInFilter.find(tag=>e.target.textContent==tag)
        if(tagInUse===undefined){
            tagInFilter.push(e.target.textContent)
            createTag(e.target.textContent)
            checkFilter();
        }
    }
})

filterDOMElement.addEventListener('click', e => {
    if(e.target.classList.contains('filter__clear')){
        //al poner todo el array vacio al recorrerlo en checkfilter la funcion every devolvera TRUE
        //ya que devulve eso si es un array vacion por lo tanto el el operador cortocircuito 
        //removera el card--hide que oculta las targetas
        tagInFilter=[]
        RemoveTag()
        checkFilter()
    }
    if(e.target.classList.contains('tag__close-img')){
       e.target.parentElement.parentElement.remove()
    //    console.log(e.target.parentElement.parentElement.firstChild.textContent)
       tagInFilter=tagInFilter.filter(el=>el!= e.target.parentElement.parentElement.firstChild.textContent)
       checkFilter()
    }
})