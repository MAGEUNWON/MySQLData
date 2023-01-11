const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mysqlConObj = require("./config/mysql");
const db = mysqlConObj.init();
const port = 3000;
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

mysqlConObj.open(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function getData() {
  const response = await fetch(
    "https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&ServiceKey=7204O8KH4D5547Q3JBB7&detail=Y&genre=SF&releaseDts=20200101&listCount=50"
  );

  //SF 코메디 공포 로맨스, 액션, 어드벤처, 드라마, 범죄, 느와르
  return response;
}

getData()
  .then((response) => response.json())
  .then((data) => {
    data = data.Data[0].Result;
    // console.log(data)

    // for (i = 0; i<6; i++){
    //   dataMovie = data.Data[0].Result[i].actors
    //   console.log(dataMovie)
    //   for(j = 0; j<6; j++){
    //     actorN = dataMovie[j].actorNm
    //   }

    // }

    // const dataArray = dataMovie.map(value =>{
    //   return value.actors.actor[0].actorNm
    // })
    // console.log(dataArray);

    const movieDataList = [];

    for (key in data) {
      let title = data[key].title;
      let repRlsDate = data[key].repRlsDate;
      let nation = data[key].nation;
      let rating = data[key].rating;
      let runtime = data[key].runtime;
      let genre = data[key].genre;
      let directors = data[key].directors.director[0].directorNm;
      let codes = data[key].Codes.Code[0].CodeNo;
      let plots = data[key].plots.plot[0].plotText;
      let actors = data[key].actors.actor[0].actorNm;
      let poster = data[key].posters;
      let array = poster.split("|", 1);
      let posters = array.toString();
      // console.log(posters);

      movieDataList.push([
        title,
        repRlsDate,
        nation,
        rating,
        runtime,
        genre,
        directors,
        codes,
        plots,
        actors,
        posters,
      ]);

      // console.log(movieDataList);
    }

    // const sql = 'insert into movieapi (title, repRlsDate, nation, rating, runtime, genre, directors, codes, plots, actors, posters) values?';

    // const param = [movieDataList];

    // db.query(sql, param, function(err, rows, fields){
    //   if(err){
    //     console.log(err);
    //   } else{
    //     console.log(rows);
    //   }
    // });

    // const sql = 'SELECT title, repRlsDate, nation, actors, plots, posters FROM movie_api WHERE genre LIKE?'
    // const param = '%' + '어드벤처' + '%';

    //   db.query(sql, [param], function(err, rows, fields){
    //     if(err){
    //       console.log(err);
    //     } else{
    //       // const SFArr = [];
    //       // for(i in rows)
    //       // console.log(rows)
    //       const a = rows;
    //       // SFArr.push(rows[i].title + rows[i].repRlsDate + rows[i].nation);
    //       // console.log(SFArr);

    //       const random = a[Math.floor(Math.random() * a.length)];
    //       console.log(random);

    //     }
    //   });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  // res.writeHead(200, {"content-Type" : "text/html"});

  const sql =
    "SELECT title, repRlsDate, nation, actors, plots, posters FROM movie_api WHERE genre LIKE?";
  const param = "%" + "로맨스" + "%";

  db.query(sql, [param], function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      const a = rows;

      const random = a[Math.floor(Math.random() * a.length)];
      console.log(random);

      // let title = req.query.title;
      // let repRlsDate = req.query.repRlsDate;
      // let nation = req.params.nation;
      // let actors = req.params.actors;
      // let plot = req.params.plot;
      // let posters = req.params.posters;
      // 얘네는 query

      console.log(random.title);
      const date = random.repRlsDate;
      const nation = random.nation;
      const plots = random.plots;
      const title = random.title;
      const posters = random.posters;
      const dateTem = ` <span> 개봉 : ${date}  </span>`;
      const nationTem = ` <span> 국가 : ${nation}  </span>`;
      const plotsTem = ` <span> 줄거리 : ${plots}  </span>`;
      const titleTem = ` <span>  ${title}  </span>`;
      const postersTem = `${posters}`;
      // <span id = "test"> + title + </span> 이런식으로 연결하면 일단 string 형태임. 이걸 content type에서 html로 출력하라고 하면 html 형태로 나올 수 있음. ( res.writeHead(200, {"Content-Type" : "text/html"})

      res.send(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <link rel="stylesheet" href="/public/index.css">
          
          <script type="module" src="/public/index.js" defer></script>
        </head>
        <body>

          <div id = "app">

            <div id = "drawer">

              <div id = "card">

                <div id = "front">
                  <img src="${postersTem}" onerror= "this.src = 'public/pepe.jpg'" alt= "포스터가 없습니다" width='500px' height='600px' >
                </div>

                <div id = "back">
                  <div>
                    <div>
                      ${dateTem}
                    </div>
                    <div>
                      ${nationTem}
                    </div>
                    <div>
                      ${plotsTem}
                    </div>
                  </div>
                </div>


              </div>
      
            </div>

            ${titleTem}

            <form method = "GET">
              <button id = "button" type = "submit" onclick = "getData()">다른 영화 추천 받기</button>
            </form>
            
          </div>

        
        </body>
        </html>
        `
      );
    }
  });
});

// const getData= async()=>{

//     await axios.get('https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&ServiceKey=7204O8KH4D5547Q3JBB7&detail=Y&genre=로맨스&releaseDts=20220901&listCount=50')
//     .then(function(response){
//       data = response.data.Data[0].Result
//       // console.log(data);
//       const movieDataList = [];

//       for(key in data){

//         let title = data[key].title;
//         let repRlsDate = data[key].repRlsDate;
//         let nation = data[key].nation;
//         let rating = data[key].rating;
//         let runtime = data[key].runtime;
//         let genre = data[key].genre;
//         let directors = data[key].directors.director[0].directorNm;
//         let codes = data[key].Codes.Code[0].CodeNo;
//         let plots = data[key].plots.plot[0].plotText;
//         let actors = data[key].actors.actor[0].actorNm;

//         movieDataList.push([title, repRlsDate, nation, rating, runtime, genre, directors, codes, plots, actors])

//         console.log(movieDataList);

//         // console.log('제목:' + data[key].title)
//         // console.log('개봉일: ' + data[key].repRlsDate)
//         // console.log('제작국가: ' + data[key].nation)
//         // console.log('관람등급: ' + data[key].rating)
//         // console.log('상영시간: ' + data[key].runtime)
//         // console.log('장르: ' + data[key].genre)
//         // console.log('감독: ' + data[key].directors.director[0].directorNm)
//         // console.log('영화코드: ' + data[key].Codes.Code[0].CodeNo)
//         // console.log('줄거리: ' + data[key].plots.plot[0].plotText)
//         // console.log('출연배우: '  + data[key].actors.actor[0].actorNm);
//         // console.log("")
//       }

//     })
//     .catch(function(error){
//       console.log(error);
//     });

//       // params:{
//       //   collection : "kmdb_new2",
//       //   ServiceKey:"7204O8KH4D5547Q3JBB7",
//       //   detail : "Y",
//       //   genre : "SF",
//       //   releaseDts : "20220901",
//       //   listCount : "50"
//       // }

// }

// getData();

// app.get('/', (req, res, next)=>{
//   // const sql = `select * from movieapi`
//   const api_KEY = '7204O8KH4D5547Q3JBB7';
//   const genre = "SF"; //SF 코메디 공포
//   const startDate = "20220901";
//   const apiURL = ` https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&ServiceKey=7204O8KH4D5547Q3JBB7&detail=Y&genre=SF&releaseDts=20220901&listCount=50`;

//   const options = {
//     method : 'GET',
//     url : apiURL,
//   }

//   request (options, (err, res, body)=>{
//     if(err){
//       throw new Error(err);
//     }

//     // const data = request.response.Data[0].Result;
//     let info = JSON.parse(body);
//     // console.log(info.Data[0].Result[0])

//     // for(let i in info['Data']['Result']){
//     //   console.log(info['Data']['Result'])
//     //   console.log(info['Data'][i]['Result'][i]['title']);
//     // }

//     const data = info.Data[0].Result;
//     // console.log(data);
//     const movieDataList = [];

//     for(key in data){
//       let title = data[key].title;
//       let repRlsDate = data[key].repRlsDate;
//       let nation = data[key].nation;
//       let rating = data[key].rating;
//       let runtime = data[key].runtime;
//       let genre = data[key].genre;
//       let directors = data[key].directors.director[0].directorNm;
//       let codes = data[key].Codes.Code[0].CodeNo;
//       let plots = data[key].plots.plot[0].plotText;
//       let actors = data[key].actors.actor[0].actorNm + ',' + data[key].actors.actor[1].actorNm;

//       // + "," + data[key].actors.actor[3].actorNm + data[key].actors.actor[4].actorNm

//       console.log('제목:' + data[key].title)
//       console.log('개봉일: ' + data[key].repRlsDate)
//       console.log('제작국가: ' + data[key].nation)
//       console.log('관람등급: ' + data[key].rating)
//       console.log('상영시간: ' + data[key].runtime)
//       console.log('장르: ' + data[key].genre)
//       console.log('감독: ' + data[key].directors.director[0].directorNm)
//       console.log('영화코드: ' + data[key].Codes.Code[0].CodeNo)
//       console.log('줄거리: ' + data[key].plots.plot[0].plotText)
//       console.log('출연배우: '  + data[key].actors.actor[0].actorNm, data[key].actors.actor[1].actorNm);
//       console.log("")

//         // , data[key].actors.actor[1].actorNm, data[key].actors.actor[2].actorNm, data[key].actors.actor[3].actorNm, data[key].actors.actor[4].actorNm)

//         movieDataList.push([title, repRlsDate, nation, rating, runtime, genre, directors, codes, plots, actors])
//         // console.log(movieDataList);
//     }

//       // const sql = 'insert into movieapi (title, repRlsDate, nation, rating, runtime, genre, directors, codes, plots, actors) values?';
//       // const param = [movieDataList];

//       // db.query(sql, param, function(err, rows, fields){
//       //   if(err){
//       //     console.log(err);
//       //   } else{
//       //     console.log(rows);
//       //   }
//       // });

//   })

// });

app.listen(port, () => {
  console.log("3000 서버 start");
});
