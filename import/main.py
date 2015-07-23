import pprint

from client import DataStoreClient

# Connect to server
server = 'http://www.ivarclemens.nl/games/backend/'
client = DataStoreClient(server)

# Load datasets associated with a specific user
datasets = client.load_datasets({'user': 'Ivar', 'game': 'MG'})

# Print results
pp = pprint.PrettyPrinter(indent = 2)
pp.pprint(datasets)
