import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Regulamin — Lokra",
};

export default function RegulaminPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:font-semibold [&_li]:mt-1.5 [&_p]:mt-3 [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">
            Regulamin świadczenia usług Lokra
          </h1>
          <p className="text-sm">Obowiązuje od: 8 czerwca 2026 r.</p>

          <h2>§1. Definicje</h2>
          <ul>
            <li>
              <strong>Usługodawca</strong> — Jakub Chodakowski, prowadzący
              jednoosobową działalność gospodarczą pod nazwą JAKUB CHODAKOWSKI,
              NIP: 6711845485, REGON: 388300543, adres: ul. Stanisława
              Koniecpolskiego 12A/7, 78-100 Kołobrzeg, adres e-mail:
              hello@jakubchodakowski.com.
            </li>
            <li>
              <strong>Serwis</strong> — strona internetowa dostępna pod adresem
              lokra.pl.
            </li>
            <li>
              <strong>Klient (Właściciel)</strong> — osoba fizyczna, osoba
              prawna lub jednostka organizacyjna, która zleca Usługodawcy
              poszukiwanie najemcy dla swojego lokalu.
            </li>
            <li>
              <strong>Konsument</strong> — Klient będący osobą fizyczną,
              zawierający umowę niezwiązaną bezpośrednio z jego działalnością
              gospodarczą lub zawodową.
            </li>
            <li>
              <strong>Najemca</strong> — kandydat na najemcę lokalu, pozyskany i
              zweryfikowany przez Usługodawcę.
            </li>
            <li>
              <strong>Usługa</strong> — usługa poszukiwania najemcy dla lokalu
              Klienta wraz z czynnościami towarzyszącymi, opisana w §3.
            </li>
            <li>
              <strong>Pakiet</strong> — wariant Usługi różniący się
              gwarantowanym terminem znalezienia najemcy i ceną.
            </li>
            <li>
              <strong>Termin gwarantowany</strong> — maksymalny czas, w jakim
              Usługodawca zobowiązuje się przedstawić Klientowi najemcę,
              właściwy dla wybranego Pakietu.
            </li>
          </ul>

          <h2>§2. Postanowienia ogólne</h2>
          <ol>
            <li>
              Regulamin określa zasady świadczenia przez Usługodawcę Usługi
              poszukiwania najemcy oraz prawa i obowiązki Stron.
            </li>
            <li>
              Kontakt z Usługodawcą jest możliwy pod adresem e-mail:
              hello@jakubchodakowski.com.
            </li>
            <li>
              Do korzystania z Serwisu wystarczające jest urządzenie z dostępem
              do internetu i aktualną przeglądarką oraz aktywny adres e-mail.
            </li>
          </ol>

          <h2>§3. Przedmiot i zakres Usługi</h2>
          <ol>
            <li>
              Usługodawca świadczy na rzecz Klienta usługę poszukiwania najemcy
              lokalu zgodnie z kryteriami wskazanymi przez Klienta.
            </li>
            <li>W ramach Usługi Usługodawca:</li>
          </ol>
          <ul>
            <li>poszukuje i dopasowuje najemcę według kryteriów Klienta,</li>
            <li>
              weryfikuje kandydata na najemcę na podstawie dokumentów i
              oświadczeń przekazanych przez kandydata, za jego uprzednią zgodą,
            </li>
            <li>udostępnia Klientowi wzór umowy najmu,</li>
            <li>zapewnia dedykowanego opiekuna oraz wsparcie, o którym mowa w §7.</li>
          </ul>
          <ol start={3}>
            <li>
              <strong>
                Usługodawca nie jest stroną umowy najmu zawieranej między
                Klientem a Najemcą.
              </strong>{" "}
              Usługodawca nie pośredniczy w podpisaniu umowy najmu ani nie
              zarządza najmem po jego rozpoczęciu.
            </li>
            <li>
              Udział Usługodawcy w oglądaniu lokalu lub przy podpisaniu umowy nie
              jest obowiązkowym elementem Usługi; może nastąpić wyłącznie po
              odrębnym uzgodnieniu Stron.
            </li>
            <li>
              Wzór umowy najmu ma charakter wzorca pomocniczego. Ostateczna treść
              i zawarcie umowy najmu pozostają w gestii Klienta i Najemcy.
            </li>
            <li>
              Usługa ma charakter usługi poszukiwania najemcy (usługi
              informacyjno-wyszukiwawczej i organizacyjnej) i — z uwagi na
              zakres określony w ust. 3-5 — nie stanowi pośrednictwa w obrocie
              nieruchomościami w rozumieniu ustawy z dnia 21 sierpnia 1997 r. o
              gospodarce nieruchomościami. Usługodawca nie reprezentuje Klienta w
              negocjacjach ani przy zawarciu umowy najmu i nie podejmuje w jego
              imieniu czynności zmierzających do jej zawarcia.
            </li>
          </ol>

          <h2>§4. Pakiety, ceny i płatność</h2>
          <ol>
            <li>Usługodawca oferuje następujące Pakiety:</li>
          </ol>
          <ul>
            <li>Pakiet za 2000 zł — Termin gwarantowany do 90 dni,</li>
            <li>Pakiet za 4000 zł — Termin gwarantowany do 60 dni,</li>
            <li>Pakiet za 6000 zł — Termin gwarantowany do 30 dni.</li>
          </ul>
          <ol start={2}>
            <li>
              Każdy Pakiet obejmuje ten sam zakres czynności (znalezienie
              najemcy, weryfikacja najemcy, wzór umowy najmu, gwarancja zwrotu
              100%, dedykowany opiekun, wsparcie po podpisaniu umowy przez 30
              dni). Pakiety różnią się wyłącznie Terminem gwarantowanym.
            </li>
            <li>
              Płatność następuje z góry, w całości, w momencie zamówienia
              Usługi, za pośrednictwem operatora płatności Stripe.
            </li>
            <li>
              Termin gwarantowany rozpoczyna bieg po zaksięgowaniu płatności i
              przekazaniu przez Klienta kryteriów oraz informacji niezbędnych do
              rozpoczęcia poszukiwań.
            </li>
            <li>Podane ceny są cenami brutto.</li>
          </ol>

          <h2>§5. Zawarcie umowy</h2>
          <ol>
            <li>
              Umowa o świadczenie Usługi zostaje zawarta z chwilą skutecznego
              dokonania płatności za wybrany Pakiet.
            </li>
            <li>
              Dokonując płatności, Klient potwierdza zapoznanie się z Regulaminem
              i jego akceptację.
            </li>
          </ol>

          <h2>§6. Gwarancja zwrotu 100%</h2>
          <ol>
            <li>
              Jeżeli w Terminie gwarantowanym Usługodawca nie przedstawi
              Klientowi zweryfikowanego najemcy spełniającego wskazane kryteria i
              gotowego zawrzeć umowę najmu, Klient otrzymuje zwrot 100%
              uiszczonej opłaty.
            </li>
            <li>
              Zwrot następuje w terminie 5 dni roboczych, bez konieczności
              podawania przez Klienta przyczyny.
            </li>
            <li>
              Bieg Terminu gwarantowanego ulega zawieszeniu, a gwarancja zwrotu
              nie przysługuje, jeżeli brak zawarcia umowy najmu wynika z przyczyn
              leżących po stronie Klienta, w szczególności gdy Klient:
            </li>
          </ol>
          <ul>
            <li>
              bez uzasadnionej przyczyny odrzuca dopasowanych, zweryfikowanych
              najemców spełniających jego kryteria,
            </li>
            <li>
              uniemożliwia obejrzenie lokalu (online lub na żywo) zainteresowanym
              kandydatom,
            </li>
            <li>
              podał nieprawdziwe lub nieaktualne kryteria, dane lub informacje o
              lokalu,
            </li>
            <li>
              wycofał lokal z najmu lub zrezygnował z poszukiwań w trakcie
              realizacji Usługi.
            </li>
          </ul>

          <h2>§7. Wsparcie po podpisaniu umowy (30 dni)</h2>
          <ol>
            <li>
              Przez 30 dni od dnia podpisania umowy najmu Usługodawca zapewnia
              Klientowi wsparcie i doradztwo dotyczące rozpoczęcia najmu.
            </li>
            <li>
              Jeżeli w tym okresie Najemca pozyskany przez Usługodawcę zrezygnuje
              lub wycofa się z najmu, Usługodawca podejmie poszukiwanie nowego
              najemcy bez dodatkowej opłaty.
            </li>
            <li>
              Na etapie, o którym mowa w ust. 2, zwrot uiszczonej opłaty nie
              przysługuje.
            </li>
          </ol>

          <h2>§8. Prawo odstąpienia (Konsument)</h2>
          <ol>
            <li>
              Konsumentowi przysługuje prawo odstąpienia od umowy zawartej na
              odległość w terminie 14 dni od dnia jej zawarcia, bez podania
              przyczyny, poprzez złożenie oświadczenia (np. na adres e-mail
              hello@jakubchodakowski.com).
            </li>
            <li>
              Klient będący Konsumentem, zamawiając Usługę, może zażądać
              rozpoczęcia jej świadczenia przed upływem terminu na odstąpienie.
              W takim przypadku Konsument przyjmuje do wiadomości, że:
            </li>
          </ol>
          <ul>
            <li>
              po pełnym wykonaniu Usługi traci prawo do odstąpienia od umowy,
            </li>
            <li>
              w razie odstąpienia przed pełnym wykonaniem Usługi zobowiązany jest
              do zapłaty za świadczenia spełnione do chwili odstąpienia,
              proporcjonalnie do zakresu wykonanej Usługi.
            </li>
          </ul>
          <ol start={3}>
            <li>
              Prawo odstąpienia nie przysługuje Klientowi niebędącemu
              Konsumentem.
            </li>
          </ol>

          <h2>§9. Obowiązki Klienta</h2>
          <ol>
            <li>
              Klient oświadcza, że posiada tytuł prawny do lokalu uprawniający go
              do oddania lokalu w najem.
            </li>
            <li>
              Klient zobowiązuje się do podania prawdziwych danych i kryteriów
              oraz do współpracy niezbędnej do realizacji Usługi (m.in.
              umożliwienia oglądania lokalu, terminowych odpowiedzi).
            </li>
          </ol>

          <h2>§10. Dane osobowe</h2>
          <ol>
            <li>
              Zasady przetwarzania danych osobowych określa{" "}
              <a
                href="/polityka-prywatnosci"
                className="text-brand underline underline-offset-2"
              >
                Polityka prywatności
              </a>
              .
            </li>
            <li>
              Weryfikacja Najemcy odbywa się wyłącznie na podstawie dokumentów i
              oświadczeń przekazanych dobrowolnie przez kandydata, za jego
              uprzednią zgodą.
            </li>
          </ol>

          <h2>§11. Reklamacje</h2>
          <ol>
            <li>
              Reklamacje można składać na adres e-mail
              hello@jakubchodakowski.com.
            </li>
            <li>
              Usługodawca rozpatruje reklamację w terminie 14 dni od jej
              otrzymania i informuje Klienta o wyniku drogą elektroniczną.
            </li>
          </ol>

          <h2>§12. Pozasądowe rozwiązywanie sporów</h2>
          <p>
            Konsument może skorzystać z pozasądowych sposobów rozpatrywania
            reklamacji i dochodzenia roszczeń, w tym za pośrednictwem platformy
            ODR Komisji Europejskiej dostępnej pod adresem
            ec.europa.eu/consumers/odr oraz właściwych instytucji (m.in. UOKiK,
            rzecznik konsumentów).
          </p>

          <h2>§13. Postanowienia końcowe</h2>
          <ol>
            <li>
              W sprawach nieuregulowanych Regulaminem stosuje się przepisy prawa
              polskiego.
            </li>
            <li>
              Usługodawca może zmienić Regulamin z ważnych przyczyn; do umów
              zawartych przed zmianą stosuje się Regulamin w brzmieniu z dnia
              zawarcia umowy.
            </li>
          </ol>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
