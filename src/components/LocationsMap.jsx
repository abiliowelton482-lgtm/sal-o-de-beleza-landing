import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search,
  Navigation,
  Star,
  Clock,
  Sparkles,
  MapPin,
  ArrowUpRight,
  Phone,
  Car,
  LocateFixed,
  Crown,
  Armchair,
  CalendarCheck
} from 'lucide-react';

// Unidades do Nexus Beauty Studio (São Paulo)
const UNITS = [
  {
    id: 'jardins',
    name: 'Unidade Jardins',
    tag: 'Flagship',
    address: 'Alameda Lorena, 1420 - Jardins',
    coords: [-23.5652, -46.6608],
    hours: { open: 9, close: 20, sunday: false },
    rating: 5.0,
    reviews: 1420,
    chairs: 14,
    phone: '(11) 9999-8888',
    parking: true,
    headline: 'A casa-mãe do Nexus Beauty Studio',
    desc: 'Espaço completo com spa capilar, sala de noivas, nail bar exclusivo, champagne bar e manobrista no local.'
  },
  {
    id: 'pinheiros',
    name: 'Unidade Pinheiros',
    address: 'Rua dos Pinheiros, 870 - Pinheiros',
    coords: [-23.5668, -46.6917],
    hours: { open: 9, close: 21, sunday: true },
    rating: 4.9,
    reviews: 910,
    chairs: 10,
    phone: '(11) 9888-1020',
    parking: false,
    headline: 'Especialistas em loiros, mechas e visagismo',
    desc: 'Ambiente contemporâneo e acolhedor, aberto aos domingos, com coloristas premiadas e linha completa de nutrição.'
  },
  {
    id: 'vila-madalena',
    name: 'Unidade Vila Madalena',
    address: 'Rua Harmonia, 315 - Vila Madalena',
    coords: [-23.5531, -46.6889],
    hours: { open: 10, close: 21, sunday: true },
    rating: 4.9,
    reviews: 745,
    chairs: 8,
    phone: '(11) 9777-3040',
    parking: false,
    headline: 'Conceito botânico e produtos veganos',
    desc: 'Rituais de aromaterapia, terapia capilar orgânica e atendimento com horário estendido para sua rotina.'
  },
  {
    id: 'itaim',
    name: 'Unidade Itaim Bibi',
    address: 'Rua João Cachoeira, 1150 - Itaim Bibi',
    coords: [-23.5846, -46.6786],
    hours: { open: 8, close: 20, sunday: false },
    rating: 4.9,
    reviews: 1050,
    chairs: 12,
    phone: '(11) 9666-5060',
    parking: true,
    headline: 'Escova express e produção executiva',
    desc: 'Abre às 8h com serviço ágil de escova, maquiagem e manicure simultânea, Wi-Fi de alta velocidade e valet.'
  },
  {
    id: 'moema',
    name: 'Unidade Moema',
    address: 'Alameda dos Arapanés, 520 - Moema',
    coords: [-23.6015, -46.6652],
    hours: { open: 9, close: 20, sunday: false },
    rating: 4.8,
    reviews: 620,
    chairs: 9,
    phone: '(11) 9555-7080',
    parking: true,
    headline: 'Spa para mãos, pés e estética facial',
    desc: 'Ambiente tranquilo e arborizado com cabines de massagem relaxante, design de sobrancelhas e pacotes mãe & filha.'
  },
  {
    id: 'brooklin',
    name: 'Unidade Brooklin',
    address: 'Avenida Padre Antônio José dos Santos, 900 - Brooklin',
    coords: [-23.6125, -46.6921],
    hours: { open: 9, close: 20, sunday: false },
    rating: 4.8,
    reviews: 490,
    chairs: 8,
    phone: '(11) 9444-9010',
    parking: true,
    headline: 'Moderna, elegante e com estacionamento próprio',
    desc: 'Ideal para quem busca praticidade no horário de almoço ou após o expediente, com cronograma capilar personalizado.'
  }
];

const DEFAULT_ORIGIN = { coords: [-23.5614, -46.6559], label: 'Av. Paulista (referência)' };

const haversineKm = ([lat1, lon1], [lat2, lon2]) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const getStatus = (hours, now = new Date()) => {
  const day = now.getDay();
  const h = now.getHours() + now.getMinutes() / 60;
  const closedToday = day === 0 && !hours.sunday;
  const isOpen = !closedToday && h >= hours.open && h < hours.close;
  if (isOpen) return { isOpen, label: `Aberta até ${hours.close}h` };
  if (!closedToday && h < hours.open) return { isOpen, label: `Abre às ${hours.open}h` };
  return { isOpen, label: 'Fechada agora' };
};

const sparklesSvg = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>`;

const buildMarkerIcon = (unit, active) =>
  L.divIcon({
    className: 'nexus-marker',
    iconSize: [56, 74],
    iconAnchor: [28, 26],
    html: `
      <div class="nexus-marker__wrap ${active ? 'is-active' : ''}">
        <div class="nexus-marker__logo">${sparklesSvg(active ? '#ffffff' : '#ec4899')}</div>
        <div class="nexus-marker__badge">★ ${unit.rating.toFixed(1)}</div>
      </div>`
  });

const originIcon = L.divIcon({
  className: 'nexus-origin',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  html: '<div class="nexus-origin__dot"></div>'
});

export default function LocationsMap() {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const originMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const cardRef = useRef(null);

  const [selectedId, setSelectedId] = useState('jardins');
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nearest');
  const [origin, setOrigin] = useState(DEFAULT_ORIGIN);
  const [geoMessage, setGeoMessage] = useState('');
  const [route, setRoute] = useState(null);
  const [cardPos, setCardPos] = useState(null);

  const units = useMemo(() => {
    const q = query.trim().toLowerCase();
    return UNITS.map((u) => ({
      ...u,
      distance: haversineKm(origin.coords, u.coords),
      status: getStatus(u.hours)
    }))
      .filter((u) => !q || `${u.name} ${u.address}`.toLowerCase().includes(q))
      .filter((u) => showFilter === 'all' || u.status.isOpen)
      .sort((a, b) => (sortBy === 'nearest' ? a.distance - b.distance : b.rating - a.rating));
  }, [query, showFilter, sortBy, origin]);

  const selected = useMemo(() => {
    const base = UNITS.find((u) => u.id === selectedId);
    return base
      ? { ...base, distance: haversineKm(origin.coords, base.coords), status: getStatus(base.hours) }
      : null;
  }, [selectedId, origin]);

  // Inicializa o mapa (Leaflet + tiles claros / clean)
  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return;
    const map = L.map(mapElRef.current, {
      center: [-23.565, -46.66],
      zoom: 12,
      maxZoom: 16,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    // Mapa base claro gratuito (Esri Light Gray Canvas)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap',
      maxZoom: 16
    }).addTo(map);
    // Camada de nomes de ruas/bairros
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      opacity: 0.9
    }).addTo(map);

    UNITS.forEach((unit) => {
      const marker = L.marker(unit.coords, { icon: buildMarkerIcon(unit, false), riseOnHover: true })
        .addTo(map)
        .on('click', () => setSelectedId(unit.id));
      markersRef.current[unit.id] = marker;
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
      originMarkerRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  // Mostra/esconde marcadores conforme filtros
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const visible = new Set(units.map((u) => u.id));
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      if (visible.has(id) && !map.hasLayer(marker)) marker.addTo(map);
      if (!visible.has(id) && map.hasLayer(marker)) map.removeLayer(marker);
    });
  }, [units]);

  // Destaca o marcador selecionado
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const unit = UNITS.find((u) => u.id === id);
      marker.setIcon(buildMarkerIcon(unit, id === selectedId));
      marker.setZIndexOffset(id === selectedId ? 1000 : 0);
    });
  }, [selectedId]);

  // Marcador de origem
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (originMarkerRef.current) originMarkerRef.current.setLatLng(origin.coords);
    else originMarkerRef.current = L.marker(origin.coords, { icon: originIcon, interactive: false }).addTo(map);
  }, [origin]);

  // Calcula rota pelas ruas (OSRM) e desenha linha rosa suave
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;
    const controller = new AbortController();
    const [oLat, oLng] = origin.coords;
    const [dLat, dLng] = selected.coords;

    const draw = (latlngs, info) => {
      if (routeLayerRef.current) map.removeLayer(routeLayerRef.current);
      const glow = L.polyline(latlngs, { color: '#f472b6', weight: 12, opacity: 0.22, lineCap: 'round' });
      const line = L.polyline(latlngs, { color: '#ec4899', weight: 3.5, opacity: 0.95, lineCap: 'round', className: 'nexus-route' });
      routeLayerRef.current = L.layerGroup([glow, line]).addTo(map);
      map.flyToBounds(L.latLngBounds(latlngs).pad(0.35), { duration: 0.8, maxZoom: 15 });
      setRoute(info);
    };

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`,
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        const r = data?.routes?.[0];
        if (!r) throw new Error('no route');
        draw(
          r.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
          { km: r.distance / 1000, min: Math.max(1, Math.round(r.duration / 60)) }
        );
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        const km = haversineKm(origin.coords, selected.coords);
        draw([origin.coords, selected.coords], { km, min: Math.max(1, Math.round((km / 25) * 60)) });
      });

    return () => controller.abort();
  }, [selected, origin]);

  // Posiciona o card flutuante ao lado do marcador selecionado
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;
    const update = () => {
      const p = map.latLngToContainerPoint(selected.coords);
      const size = map.getSize();
      setCardPos({ x: p.x, y: p.y, w: size.x, h: size.y, cardH: cardRef.current?.offsetHeight || 330 });
    };
    update();
    map.on('move zoom resize', update);
    return () => map.off('move zoom resize', update);
  }, [selected]);

  const cardStyle = useMemo(() => {
    if (!cardPos || cardPos.w < 640) return null;
    const cardW = 310;
    const { cardH } = cardPos;
    let left = cardPos.x + 40;
    if (left + cardW > cardPos.w - 16) left = cardPos.x - cardW - 40;
    left = Math.min(Math.max(left, 16), cardPos.w - cardW - 16);
    const top = Math.min(Math.max(cardPos.y - cardH / 2, 16), cardPos.h - cardH - 16);
    return { left, top, width: cardW };
  }, [cardPos]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoMessage('Seu navegador não suporta geolocalização.');
      return;
    }
    setGeoMessage('Localizando...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const c = [coords.latitude, coords.longitude];
        if (haversineKm(c, DEFAULT_ORIGIN.coords) > 80) {
          setGeoMessage('Você está fora de São Paulo — usando a Av. Paulista como referência.');
          return;
        }
        setOrigin({ coords: c, label: 'Sua localização' });
        setSortBy('nearest');
        setGeoMessage('');
      },
      () => setGeoMessage('Não foi possível obter sua localização.'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const directionsUrl = selected
    ? `https://www.google.com/maps/dir/?api=1&origin=${origin.coords.join(',')}&destination=${selected.coords.join(',')}&travelmode=driving`
    : '#';
  const placeUrl = selected ? `https://www.google.com/maps/search/?api=1&query=${selected.coords.join(',')}` : '#';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold text-pink-500 tracking-widest uppercase mb-1">NOSSOS ESTÚDIOS</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">Encontre o Nexus mais perto de você</h2>
          <p className="text-gray-600 text-sm mt-2 max-w-xl">
            {UNITS.length} unidades em São Paulo com o mesmo padrão de cuidado, sofisticação e conforto. Selecione uma unidade para ver a rota.
          </p>
        </div>
        <button
          onClick={useMyLocation}
          className="self-start sm:self-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-50 hover:bg-pink-100 px-4 py-2.5 rounded-full border border-pink-200 transition-colors cursor-pointer"
        >
          <LocateFixed className="w-4 h-4" />
          Usar minha localização
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[360px_1fr]">
        {/* Sidebar Clean */}
        <aside className="order-2 lg:order-1 flex flex-col border-t lg:border-t-0 lg:border-r border-gray-100 bg-white lg:h-[640px]">
          <div className="p-5 border-b border-gray-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center shadow-md shadow-pink-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-900 font-bold leading-tight">Nexus Beauty Studio</p>
                <p className="text-[11px] text-gray-500">{units.length} de {UNITS.length} unidades</p>
              </div>
            </div>

            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar bairro ou unidade..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-[11px] text-gray-500 font-medium">
                Mostrar
                <select
                  value={showFilter}
                  onChange={(e) => setShowFilter(e.target.value)}
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2.5 text-xs text-gray-800 focus:outline-none focus:border-pink-400"
                >
                  <option value="all">Todas</option>
                  <option value="open">Abertas agora</option>
                </select>
              </label>
              <label className="text-[11px] text-gray-500 font-medium">
                Ordenar por
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2.5 text-xs text-gray-800 focus:outline-none focus:border-pink-400"
                >
                  <option value="nearest">Mais próxima</option>
                  <option value="rating">Melhor avaliada</option>
                </select>
              </label>
            </div>
            <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-pink-500" />
              Distâncias a partir de: <span className="text-gray-800 font-medium">{origin.label}</span>
            </p>
            {geoMessage && <p className="text-[11px] text-pink-600 font-medium">{geoMessage}</p>}
          </div>

          <ul className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[420px] lg:max-h-none nexus-scroll">
            {units.length === 0 && (
              <li className="text-center text-sm text-gray-400 py-10">Nenhuma unidade encontrada.</li>
            )}
            {units.map((u) => {
              const active = u.id === selectedId;
              return (
                <li key={u.id}>
                  <button
                    onClick={() => setSelectedId(u.id)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-pink-50/80 border-pink-300 shadow-sm'
                        : 'bg-gray-50/60 border-transparent hover:bg-pink-50/40 hover:border-pink-100'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-500'}`}>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm font-semibold truncate flex items-center gap-1.5">
                        {u.name}
                        {u.tag && <Crown className="w-3.5 h-3.5 text-pink-500 shrink-0" />}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {u.distance.toFixed(1)} km •{' '}
                        <span className={u.status.isOpen ? 'text-pink-600 font-medium' : 'text-gray-400'}>{u.status.label}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[11px] text-gray-500 shrink-0">
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <Star className="w-3 h-3 fill-pink-500 text-pink-500" />
                        {u.rating.toFixed(1)}
                      </span>
                      {u.parking && <Car className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Mapa Light */}
        <div className="order-1 lg:order-2 relative h-[460px] sm:h-[560px] lg:h-[640px] bg-gray-100">
          <div ref={mapElRef} className="absolute inset-0 z-0" />

          {selected && (
            <div
              ref={cardRef}
              style={cardStyle || undefined}
              className={`absolute z-[500] bg-white/95 backdrop-blur-xl border border-pink-100 rounded-2xl p-5 shadow-2xl transition-[left,top] duration-200 ${
                cardStyle ? '' : 'left-3 right-3 bottom-3'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-pink-500 flex items-center justify-center shrink-0 text-white shadow-md shadow-pink-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-900 font-bold truncate flex items-center gap-2">
                    {selected.name}
                    {selected.tag && (
                      <span className="text-[9px] uppercase tracking-widest bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded font-bold">{selected.tag}</span>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {selected.distance.toFixed(1)} km •{' '}
                    <span className={selected.status.isOpen ? 'text-pink-600 font-medium' : ''}>{selected.status.label}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-[11px] text-gray-600 font-medium">
                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />{selected.rating.toFixed(1)} ({selected.reviews})</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-pink-500" />{selected.hours.open}h–{selected.hours.close}h</span>
                <span className="flex items-center gap-1.5"><Armchair className="w-3.5 h-3.5 text-pink-500" />{selected.chairs} poltronas</span>
              </div>

              <h4 className="hidden sm:block text-gray-900 font-bold mt-4 text-sm">{selected.headline}</h4>
              <p className="hidden sm:block text-gray-600 text-xs mt-1.5 leading-relaxed">{selected.desc}</p>
              <p className="text-gray-700 text-xs mt-3 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                {selected.address}, São Paulo - SP
              </p>
              <p className="text-gray-700 text-xs mt-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-pink-500" />
                {selected.phone}
                {route && (
                  <span className="ml-auto text-pink-600 font-semibold flex items-center gap-1">
                    <Car className="w-3.5 h-3.5" /> ~{route.min} min • {route.km.toFixed(1)} km
                  </span>
                )}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 rounded-xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-pink-200"
                >
                  <Navigation className="w-3.5 h-3.5" /> Traçar rota
                </a>
                <a
                  href={placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 hover:border-pink-300 text-gray-800 font-bold py-2.5 rounded-xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors bg-white"
                >
                  Google Maps <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <button
                onClick={() => document.getElementById('agendamento')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full mt-2 text-[11px] text-gray-500 hover:text-pink-600 font-semibold flex items-center justify-center gap-1.5 py-1.5 transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" /> Agendar nesta unidade
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

