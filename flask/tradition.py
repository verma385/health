import json
import requests
from flask import Flask, request, jsonify

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator # scikit-learn
from scipy.stats import norm
from scipy.spatial.distance import cdist

class TraditionalPNN(BaseEstimator):
    def __init__(self, sigma=3):
        self.sigma = sigma
        
    def fit(self, X, y):
        self.classes_ = np.unique(y)
        self.y_ = y
        self.X_ = X
        
        # Calculate the class priors
        self.class_priors_ = np.zeros(len(self.classes_))
        for i, c in enumerate(self.classes_):
            self.class_priors_[i] = np.sum(y == c) / len(y)
            
    def _kernel_function(self, X, sigma):
        return norm.pdf(X, loc=0, scale=sigma)
    
    def predict(self, X, top_n=3):
        y_pred = np.zeros((X.shape[0], top_n))
        y_pred_proba = np.zeros((X.shape[0], top_n))

        for i, x in enumerate(X):
            p = np.zeros(len(self.classes_))
            for j, c in enumerate(self.classes_):
                X_c = self.X_[self.y_ == c]
                distances = cdist(x.reshape(1, -1), X_c, metric='euclidean')
                kernel_values = self._kernel_function(distances, self.sigma)
                p[j] = self.class_priors_[j] * np.mean(kernel_values)

            # get the indices of the top_n probabilities
            top_indices = np.argpartition(p, -top_n)[-top_n:]
            top_indices = top_indices[np.argsort(p[top_indices])[::-1]]

            y_pred[i] = self.classes_[top_indices]
            y_pred_proba[i] = p[top_indices] / np.sum(p)

        return y_pred, y_pred_proba

    
    def score(self, X, y):
        y_pred, _ = self.predict(X)
        y_pred = y_pred[:, 0] # select the first predicted class
        return np.mean(y_pred == y)
