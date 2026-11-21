/* Oaxaca Infinita: navegación, cotizador y solicitud al concierge. */
const TICKET_PRICE_MXN = 120000;
const SECOND_TICKET_DISCOUNT = 0.15;
const ROUTE_SEQUENCE = ['Mixteca', 'Huazolotitlán', 'Puerto Ángel'];

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initQuoteCalculator();
  initQuoteRequest();
  initModalBackdropClose();
});

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function getQuoteDetails() {
  const ticketSelect = document.getElementById('quoteTickets');
  const editionSelect = document.getElementById('quoteEdition');
  const ticketsCount = Number(ticketSelect?.value || 1);
  const tripEdition = editionSelect?.value || 'Febrero';
  const savings = ticketsCount > 1 ? TICKET_PRICE_MXN * SECOND_TICKET_DISCOUNT : 0;
  const total = TICKET_PRICE_MXN + (ticketsCount > 1 ? TICKET_PRICE_MXN - savings : 0);

  return {
    ticket_price: TICKET_PRICE_MXN,
    tickets_count: ticketsCount,
    discount_applied_second_ticket: SECOND_TICKET_DISCOUNT,
    estimated_total_mxn: total,
    savings_mxn: savings,
    trip_edition_or_month: tripEdition,
    route_sequence: ROUTE_SEQUENCE,
    instant_quote_promo: true
  };
}

function formatMxn(amount) {
  return `$${amount.toLocaleString('es-MX')} MXN`;
}

function updateQuoteDisplay() {
  const quote = getQuoteDetails();
  const total = document.getElementById('quoteTotal');
  const savings = document.getElementById('quoteSavings');
  const savingsLabel = document.getElementById('quoteSavingsLabel');

  if (total) total.textContent = formatMxn(quote.estimated_total_mxn);
  if (savings) {
    savings.textContent = quote.tickets_count > 1
      ? `Ahorras ${formatMxn(quote.savings_mxn)}`
      : formatMxn(quote.ticket_price);
  }
  if (savingsLabel) {
    savingsLabel.textContent = quote.tickets_count > 1 ? 'Descuento en el 2.º boleto' : 'Precio por boleto';
  }
}

function initQuoteCalculator() {
  const ticketSelect = document.getElementById('quoteTickets');
  const editionSelect = document.getElementById('quoteEdition');
  ticketSelect?.addEventListener('change', updateQuoteDisplay);
  editionSelect?.addEventListener('change', updateQuoteDisplay);
  updateQuoteDisplay();
}

function initQuoteRequest() {
  document.getElementById('quoteRequestButton')?.addEventListener('click', () => {
    const quote = getQuoteDetails();
    openLeadModal(quote);
  });
}

function openLeadModal(quote = getQuoteDetails()) {
  const backdrop = document.getElementById('leadModal');
  const summary = document.getElementById('modalQuoteSummary');
  const form = document.getElementById('modalCrmForm');
  if (!backdrop || !form) return;

  document.getElementById('crmSelectedEdition').value = quote.trip_edition_or_month;
  document.getElementById('crmTicketCount').value = String(quote.tickets_count);
  document.getElementById('crmEstimatedTotal').value = String(quote.estimated_total_mxn);
  document.getElementById('crmSavings').value = String(quote.savings_mxn);
  if (summary) {
    summary.textContent = `${quote.trip_edition_or_month} · ${quote.tickets_count} ${quote.tickets_count === 1 ? 'boleto' : 'boletos'} · ${formatMxn(quote.estimated_total_mxn)}${quote.savings_mxn ? ` · ahorras ${formatMxn(quote.savings_mxn)}` : ''}`;
  }
  const feedback = document.getElementById('crmFeedback');
  if (feedback) feedback.textContent = '';
  backdrop.classList.add('active');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('crmName')?.focus();
}

function closeLeadModal() {
  const backdrop = document.getElementById('leadModal');
  if (!backdrop) return;

  backdrop.classList.remove('active');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.getElementById('quoteRequestButton')?.focus();
}

function initModalBackdropClose() {
  const backdrop = document.getElementById('leadModal');
  if (!backdrop) return;

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeLeadModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop.classList.contains('active')) closeLeadModal();
  });
}
