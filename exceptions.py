class DeploymentException(Exception):
    def __init__(self, msg):
        super().__init__(msg)
        self.msg = msg