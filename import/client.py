
import pandas
import urllib2
import json
import numpy


def filter_dataset(dataset, filter):
    if filter == None:
        return True

    if 'user' in filter:
        if dataset['user'] != filter['user']:
            return False

    if 'game' in filter:
        if dataset['game'] != filter['game']:
            return False

    if 'session' in filter:
        if dataset['session'] != filter['session']:
            return False

    if 'debug' in filter:
        if dataset['debug'] != filter['debug']:
            return False

    return True


class DataStoreClient():

    def __init__(self, server):
        self.server = server

    def filter_datasets(self, datasets, filter):
        pass

    def list_datasets(self, filter = None):
        response = urllib2.urlopen(self.server + '?format=json')
        datasets = json.loads(response.read())

        return [dataset for dataset in datasets if filter_dataset(dataset, filter)]

    def load_datasets(self, filter = None):
        datasets = self.list_datasets(filter)
        return [self.load_dataset(dataset) for dataset in datasets]

    def load_dataset(self, dataset):
        if(dataset['game'] == 'AG'):
            dtype = {
                'Move': numpy.int64,
                'X': numpy.float64,
                'Y': numpy.float64
            }
        elif(dataset['game'] == 'MG'):
            dtype = {
                'Move': numpy.int64,
                'X': numpy.int64,
                'Y': numpy.int64
            }
        else:
            return None

        url = self.server + '/datasets/' + dataset['filename']
        data = pandas.read_csv(url,
            parse_dates = True,
            comment = '#',
            index_col = 1,
            dtype = dtype)
        return (dataset, data)
