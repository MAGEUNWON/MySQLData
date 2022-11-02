const app = document.getElementById("app");

const drawer = app.children[0];
const span = app.children[1];
const button = app.children[2];

const card = drawer.children[0];
const front = card.children[0];
const back = card.children[1];

let isClick = true;

drawer.addEventListener('click', ()=>{
  if(isClick===true){
    isClick = false;
    console.log(isClick);

    card.style.transformStyle = "preserve-3d";
    card.style.transform = "rotateY(180deg)";
    card.style.transition = "1s";
  } else{
    isClick = true;
    console.log(isClick);

    card.style.transformStyle = "preserve-3d";
    card.style.transform = "rotateY(0deg)";
    card.style.transition = "1s";
    front.style.backfaceVisibility = "visible";
  }
})

// button.addEventListener('click', ()=>{

//   const sql = 'SELECT title, repRlsDate, nation, plots, posters FROM movie_api WHERE genre LIKE?'
//   const param = '%' + '어드벤처' + '%';

//       db.query(sql, [param], function(err, rows, fields){
//         if(err){
//           console.log(err);
//         } else{
//           // const SFArr = [];
//           // for(i in rows)
//           // console.log(rows)
//           const a = rows;
//           // SFArr.push(rows[i].title + rows[i].repRlsDate + rows[i].nation);
//           // console.log(SFArr);

//           const random = a[Math.floor(Math.random() * a.length)];
//           console.log(random);
          
//         }

//       });
// })