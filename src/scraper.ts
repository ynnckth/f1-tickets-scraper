import axios from 'axios';
import cheerio from 'cheerio';

type Ticket = {
  grandstandName: string;
  price: string;
  isAvailable: boolean;
}

const url = 'https://singaporegp.sg/en/tickets/general-tickets/grandstands/';

async function fetchHTML(url: string): Promise<string> {
  const { data } = await axios.get(url);
  return data as string;
}

async function scrapeTickets() {
  try {
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    const allTickets: Ticket[] = [];

    $('div[data-category=grandstands]').each((_, grandStandElement) => {
      const grandstandName = $(grandStandElement).find('div[class*=tickets_panel-title] p').text().trim();
      const price = $(grandStandElement).find('[class*=tickets_ticket-price]').text().trim();
      const buyButtonText = $(grandStandElement).find('[class*=tickets_btn-buy-wrapper]').text().trim();
      const isAvailable = buyButtonText.toLowerCase().includes("buy");

      allTickets.push({grandstandName, price, isAvailable});
    });

    const allAvailableTickets = allTickets.filter(ticket => ticket.isAvailable);
    const available3DayTickets = allAvailableTickets
        .filter(ticket => !ticket.grandstandName.toLowerCase().includes("friday")
            && !ticket.grandstandName.toLowerCase().includes("saturday")
            && !ticket.grandstandName.toLowerCase().includes("sunday"))

    available3DayTickets.forEach(printTicket);
  } catch (error) {
    console.error('Error fetching or parsing the page:', error);
  }
}

function printTicket(ticket: Ticket) {
  console.log(`${ticket.grandstandName}: ${ticket.price}`)
}

scrapeTickets().then(() => console.log("Done"));

