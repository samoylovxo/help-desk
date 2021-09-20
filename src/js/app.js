import { Desk } from './components/Desk';

const desk = new Desk('.desk', 'http://localhost:7070');
window.desk = desk;

// (async () => {
//   const post = await fetch(
//     'http://localhost:7070?method=createTicket&name=qwe&description=asdasd',
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//     }
//   );

//   post.json().then((response) => console.log(response));
// })();
