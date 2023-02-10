using System.IO;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BUResourcesManagementAPI.Controllers
{
    public class EbookController : ApiController
    {
        string bookPath_Pdf = @"C:\MyWorkSpace\SelfDev\UserAPI\UserAPI\Books\sample.pdf";
        string bookPath_xls = @"C:\Users\ADMIN\Documents\Validation Scope.xlsx";
        string bookPath_doc = @"C:\MyWorkSpace\SelfDev\UserAPI\UserAPI\Books\sample.doc";
        string bookPath_zip = @"C:\MyWorkSpace\SelfDev\UserAPI\UserAPI\Books\sample.zip";

        [HttpGet]
        [Route("Ebook/GetBookFor/{format}")]
        public IHttpActionResult GetbookFor(string format)
        {
            string reqBook = format.ToLower() == "pdf" ? bookPath_Pdf : (format.ToLower() == "xls" ? bookPath_xls : (format.ToLower() == "doc" ? bookPath_doc : bookPath_zip));
            string bookName = "sample." + format.ToLower();

            //converting Pdf file into bytes array  
            var dataBytes = File.ReadAllBytes(reqBook);
            //adding bytes to memory stream   
            var dataStream = new MemoryStream(dataBytes);
            return new eBookResult(dataStream, Request, bookName);
        }
        [HttpGet]
        [Route("Ebook/GetBookForHRM/{format}")]
        public HttpResponseMessage GetBookForHRM(string format)
        {
            string reqBook = format.ToLower() == "pdf" ? bookPath_Pdf : (format.ToLower() == "xls" ? bookPath_xls : (format.ToLower() == "doc" ? bookPath_doc : bookPath_zip));
            string bookName = "sample." + format.ToLower();
            //converting Pdf file into bytes array  
            var dataBytes = File.ReadAllBytes(reqBook);
            //adding bytes to memory stream   
            var dataStream = new MemoryStream(dataBytes);

            HttpResponseMessage httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);
            httpResponseMessage.Content = new StreamContent(dataStream);
            httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = bookName;
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
            return httpResponseMessage;
        }
    }

    public class eBookResult : IHttpActionResult
    {
        MemoryStream bookStuff;
        string PdfFileName;
        HttpRequestMessage httpRequestMessage;
        HttpResponseMessage httpResponseMessage;
        public eBookResult(MemoryStream data, HttpRequestMessage request, string filename)
        {
            bookStuff = data;
            httpRequestMessage = request;
            PdfFileName = filename;
        }
        public System.Threading.Tasks.Task<HttpResponseMessage> ExecuteAsync(System.Threading.CancellationToken cancellationToken)
        {
            httpResponseMessage = httpRequestMessage.CreateResponse(HttpStatusCode.OK);
            httpResponseMessage.Content = new StreamContent(bookStuff);
            //httpResponseMessage.Content = new ByteArrayContent(bookStuff.ToArray());  
            httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = PdfFileName;
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

            return System.Threading.Tasks.Task.FromResult(httpResponseMessage);
        }
    }
}

