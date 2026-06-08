import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Polityka prywatności — Lokra",
};

export default function PolitykaPrywatnosciPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:font-semibold [&_li]:mt-1.5 [&_p]:mt-3 [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">
            Polityka prywatności
          </h1>
          <p className="text-sm">Obowiązuje od: 8 czerwca 2026 r.</p>

          <h2>1. Administrator danych</h2>
          <p>
            Administratorem danych osobowych jest Jakub Chodakowski, prowadzący
            jednoosobową działalność gospodarczą pod nazwą JAKUB CHODAKOWSKI,
            NIP: 6711845485, REGON: 388300543, adres: ul. Stanisława
            Koniecpolskiego 12A/7, 78-100 Kołobrzeg (dalej: „Administrator").
            Kontakt w sprawach danych osobowych: hello@jakubchodakowski.com.
          </p>

          <h2>2. Jakie dane przetwarzamy</h2>
          <ul>
            <li>
              <strong>Dane z formularza kontaktowego:</strong> imię, numer
              telefonu, adres e-mail oraz treść wiadomości.
            </li>
            <li>
              <strong>Dane Klientów (Właścicieli):</strong> dane niezbędne do
              zawarcia i realizacji umowy oraz rozliczeń (m.in. dane
              kontaktowe, informacje o lokalu, dane do płatności i rozliczeń
              podatkowych).
            </li>
            <li>
              <strong>Dane kandydatów na najemców:</strong> dane przekazane
              dobrowolnie na potrzeby weryfikacji (m.in. dane identyfikacyjne i
              kontaktowe, informacje o dochodach, referencje, oświadczenia oraz
              dokumenty przedstawione przez kandydata), przetwarzane na podstawie
              zgody kandydata.
            </li>
          </ul>

          <h2>3. Cele i podstawy prawne przetwarzania</h2>
          <ul>
            <li>
              obsługa zapytań z formularza kontaktowego — art. 6 ust. 1 lit. f
              RODO (prawnie uzasadniony interes Administratora polegający na
              udzieleniu odpowiedzi);
            </li>
            <li>
              zawarcie i wykonanie umowy o świadczenie Usługi — art. 6 ust. 1
              lit. b RODO;
            </li>
            <li>
              weryfikacja kandydata na najemcę — art. 6 ust. 1 lit. a RODO
              (zgoda kandydata);
            </li>
            <li>
              wypełnienie obowiązków prawnych (m.in. księgowych i podatkowych) —
              art. 6 ust. 1 lit. c RODO;
            </li>
            <li>
              ustalenie, dochodzenie lub obrona roszczeń — art. 6 ust. 1 lit. f
              RODO.
            </li>
          </ul>

          <h2>4. Odbiorcy danych</h2>
          <p>
            Dane mogą być powierzane podmiotom wspierającym Administratora w
            świadczeniu usług, wyłącznie w zakresie niezbędnym, w szczególności:
          </p>
          <ul>
            <li>Vercel Inc. — hosting Serwisu,</li>
            <li>Stripe — obsługa płatności,</li>
            <li>Web3Forms — dostarczanie wiadomości z formularza kontaktowego,</li>
            <li>
              Supabase — obsługa kont użytkowników (jeżeli Klient zakłada konto),
            </li>
            <li>biuro rachunkowe — obsługa księgowa i rozliczenia.</li>
          </ul>

          <h2>5. Przekazywanie danych poza EOG</h2>
          <p>
            Niektórzy dostawcy (m.in. Vercel, Stripe) mogą przetwarzać dane poza
            Europejskim Obszarem Gospodarczym. W takim przypadku przekazanie
            odbywa się na podstawie odpowiednich zabezpieczeń, w szczególności
            standardowych klauzul umownych zatwierdzonych przez Komisję
            Europejską.
          </p>

          <h2>6. Okres przechowywania</h2>
          <ul>
            <li>
              dane z formularza kontaktowego — do czasu zakończenia obsługi
              zapytania, a następnie przez okres przedawnienia ewentualnych
              roszczeń;
            </li>
            <li>
              dane związane z umową — przez okres jej realizacji oraz przez czas
              wymagany przepisami (m.in. podatkowymi) i okres przedawnienia
              roszczeń;
            </li>
            <li>
              dane przetwarzane na podstawie zgody — do czasu wycofania zgody.
            </li>
          </ul>

          <h2>7. Prawa osób, których dane dotyczą</h2>
          <p>Przysługuje Ci prawo do:</p>
          <ul>
            <li>dostępu do danych oraz otrzymania ich kopii,</li>
            <li>sprostowania danych,</li>
            <li>usunięcia danych,</li>
            <li>ograniczenia przetwarzania,</li>
            <li>przenoszenia danych,</li>
            <li>sprzeciwu wobec przetwarzania,</li>
            <li>
              cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność z
              prawem przetwarzania przed jej cofnięciem),
            </li>
            <li>
              wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych
              (PUODO).
            </li>
          </ul>
          <p>
            W celu realizacji praw skontaktuj się pod adresem
            hello@jakubchodakowski.com.
          </p>

          <h2>8. Dobrowolność podania danych</h2>
          <p>
            Podanie danych jest dobrowolne, jednak niezbędne do skorzystania z
            formularza kontaktowego, zawarcia umowy lub przeprowadzenia
            weryfikacji. Brak podania danych uniemożliwia realizację tych
            czynności.
          </p>

          <h2>9. Pliki cookies</h2>
          <ol>
            <li>
              Serwis korzysta wyłącznie z plików cookies niezbędnych do jego
              prawidłowego działania (m.in. cookies technicznych dostawcy
              hostingu oraz operatora płatności na etapie realizacji płatności).
            </li>
            <li>
              Obecnie Serwis nie wykorzystuje cookies analitycznych ani
              marketingowych.
            </li>
            <li>
              Ustawienia cookies możesz zmienić w swojej przeglądarce.
              Ograniczenie cookies niezbędnych może wpłynąć na działanie
              Serwisu.
            </li>
          </ol>

          <h2>10. Zmiany Polityki prywatności</h2>
          <p>
            Administrator może aktualizować niniejszą Politykę. Aktualna wersja
            jest każdorazowo dostępna w Serwisie.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
