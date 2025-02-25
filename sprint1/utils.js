export default function handleError(error, process) {
  if (error.response) {
    console.error(`${process} 중 response 문제`);
    console.log(error.status);
    console.log(error.message);
  } else if (error.request) {
    console.error(`${process} 중 request 문제`);
    console.log(error.status);
    console.log(error.message);
  } else {
    console.error(`${process} 중 알수없는 문제`);
    console.log(error.status);
    console.log(error.message);
    console.log(error);
  }
}
