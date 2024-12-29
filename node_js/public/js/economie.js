// Variable pour stocker l'instance du graphique
let economyChartInstance = null;

// Fonction pour récupérer les données économiques et calculer l'évolution
async function fetchEconomyData(typeFacture) {
    try {
        console.log(`Chargement des données pour le type de facture: ${typeFacture}`);

        // Requête pour récupérer les 24 dernières factures d'un type donné
        const response = await fetch(`/api/economie?type=${typeFacture}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        const factures = await response.json();

        // Vérifier si on a bien 24 factures
        if (factures.length < 24) {
            alert("Moins de 24 factures disponibles pour ce type.");
            return;
        }

        // Diviser les factures en deux groupes : les 12 plus récentes et les 12 plus anciennes
        const recentFactures = factures.slice(0, 12);
        const oldFactures = factures.slice(12, 24);

        // Calculer la consommation moyenne des deux groupes
        const avgRecentConsumption = recentFactures.reduce((sum, facture) => sum + facture.consommation, 0) / recentFactures.length;
        const avgOldConsumption = oldFactures.reduce((sum, facture) => sum + facture.consommation, 0) / oldFactures.length;

        // Calcul de l'évolution en pourcentage
        const evolution = ((avgRecentConsumption - avgOldConsumption) / avgOldConsumption) * 100;

        // Extraire les dates et consommations pour l'affichage du graphique
        const labels = recentFactures.map(facture => new Date(facture.date_facture).toLocaleDateString());
        const consommationRecentData = recentFactures.map(facture => facture.consommation);
        const consommationOldData = oldFactures.map(facture => facture.consommation);

        // Si un graphique existe déjà, le détruire avant de créer un nouveau
        if (economyChartInstance) {
            economyChartInstance.destroy();
        }

        // Créer un nouveau graphique
        const ctx = document.getElementById('economyChart').getContext('2d');
        economyChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `12 dernières factures (${typeFacture})`,
                        data: consommationRecentData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true
                    },
                    {
                        label: `12 factures plus anciennes (${typeFacture})`,
                        data: consommationOldData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Date de Facture'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Consommation (unités)'
                        }
                    }
                }
            }
        });

        // Afficher l'évolution en pourcentage sur la page
        const evolutionText = document.getElementById('evolutionText');
        evolutionText.textContent = `Évolution de la consommation : ${evolution.toFixed(2)}%`;
    } catch (error) {
        console.error('Erreur:', error);
        alert('Impossible de charger les données économiques.');
    }
}

// Charger les données de consommation pour l'électricité au chargement initial
window.onload = () => fetchEconomyData('electricite');
