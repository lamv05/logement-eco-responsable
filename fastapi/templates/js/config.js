const API_URL = '/api/capteurs-actionneurs';

async function fetchDevices() {
  try {
    const response = await fetch(API_URL);
    const devices = await response.json();
    const tableBody = document.getElementById('deviceTable');
    tableBody.innerHTML = '';

    devices.forEach((device) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${device.id}</td>
        <td>${device.reference_commerciale}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteDevice(${device.id})">Supprimer</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible de charger les capteurs/actionneurs.');
  }
}

async function addDevice(event) {
  event.preventDefault();

  const reference = document.getElementById('reference').value;
  const piece = document.getElementById('piece').value;
  const type = document.getElementById('type').value;
  const port = document.getElementById('port').value;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference_commerciale: reference, reference_piece: piece, type_device: type, port_com_serv: port }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout.');
    }

    document.getElementById('addDeviceForm').reset();
    fetchDevices();
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible d\'ajouter le capteur/actionneur.');
  }
}

async function deleteDevice(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression.');
    }

    fetchDevices();
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible de supprimer le capteur/actionneur.');
  }
}

document.getElementById('addDeviceForm').addEventListener('submit', addDevice);
window.onload = fetchDevices;
