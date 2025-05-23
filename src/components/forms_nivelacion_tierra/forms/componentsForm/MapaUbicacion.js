'use client';

import { MapContainer, TileLayer, Marker, useMap, useMapEvents, GeoJSON } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { Hgo_Info } from '../../../landing/maps/Hgo';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/planhidrico/img/forms nivelacion tierra/iconos/pin.png',
  iconUrl: '/planhidrico/img/forms nivelacion tierra/iconos/pin.png',
  shadowUrl: '',
});

const LocationPicker = ({ setFieldValue }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setFieldValue('latitud', lat.toFixed(6));
      setFieldValue('longitud', lng.toFixed(6));
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const SearchMunicipio = () => {
  const map = useMap();
  const [selectedMunicipio, setSelectedMunicipio] = useState('');

  // Extraemos la lista de municipios desde las features del GeoJSON
  const options = Hgo_Info.features.map(feature => feature.properties.NOM_MUN);

  const handleSearch = (e) => {
    const municipio = e.target.value;
    setSelectedMunicipio(municipio);
    if (municipio !== '') {
      // Buscar la feature que coincida con el nombre seleccionado
      const feature = Hgo_Info.features.find(f => f.properties.NOM_MUN === municipio);
      if (feature) {
        // Crear una capa temporal para obtener los límites del polígono
        const layer = L.geoJSON(feature);
        const bounds = layer.getBounds();
        // Ajustar el mapa a los límites del polígono con un zoom máximo especificado
        if (bounds.isValid()) {
          map.fitBounds(bounds, { maxZoom: 13 });
        }
        // Definir el estilo resaltado
        const highlightStyle = {
          color: '#DEC9A3',
          weight: 3,
          fillOpacity: 0.5,
        };
        // Crear una capa con el estilo resaltado
        const highlightLayer = L.geoJSON(feature, { style: highlightStyle });
        highlightLayer.addTo(map);
        // Remover el resaltado después de 3 segundos
        setTimeout(() => {
          map.removeLayer(highlightLayer);
        }, 3000);
      }
    }
  };

  return (
    <div style={{ position: 'absolute', top: 10, left: 55, zIndex: 1000, background: 'white', padding: '5px' }}>
      <select onChange={handleSearch} value={selectedMunicipio}>
        <option value="">Buscar municipio</option>
        {options.map((nom, index) => (
          <option key={index} value={nom}>{nom}</option>
        ))}
      </select>
    </div>
  );
};

const CtrlScrollZoomMessage = () => {
  const map = useMap();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let timer = null;
    const container = map.getContainer();

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        // Si se mantiene Ctrl, se previene el comportamiento predeterminado y se realiza el zoom.
        e.preventDefault();
        const currentZoom = map.getZoom();
        const delta = e.deltaY < 0 ? 1 : -1;
        map.setZoom(currentZoom + delta);
      } else {
        // Si no se presiona Ctrl, se permite el scroll normal de la página y se muestra el mensaje.
        if (!showMessage) {
          setShowMessage(true);
        }
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          setShowMessage(false);
        }, 1000);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (timer) clearTimeout(timer);
    };
  }, [map, showMessage]);

  return showMessage ? (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      zIndex: 2000,
      pointerEvents: 'none'
    }}>
      Utiliza la tecla Ctrl junto con la rueda de desplazamiento del mouse para acercar o alejar el mapa
    </div>
  ) : null;
};

const MapaUbicacion = ({ setFieldValue }) => {
  return (
    <MapContainer
      center={[20.23300374867549, -99.21572109443447]}
      zoom={9}
      attributionControl={false}
      minZoom={8}
      maxZoom={20}
      scrollWheelZoom={false}
      style={{ height: '450px', width: '100%' }}
    >
      <TileLayer
        url="http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        maxZoom={20}
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
      />

      {/* Se agrega el componente para mostrar el mensaje y el zoom con Ctrl + scroll */}
      <CtrlScrollZoomMessage />
      
      <SearchMunicipio />

      <GeoJSON
        data={Hgo_Info}
        style={() => ({
          color: '#691B32',
          weight: 2,
          fillOpacity: 0.2,
        })}
      />

      <LocationPicker setFieldValue={setFieldValue} />
    </MapContainer>
  );
};

export default MapaUbicacion;
