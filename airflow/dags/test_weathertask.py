import weathertask

def test_milliseconds():
    weathertask.fetch("2020-11-28T11:30:00.012331+00:00","2020-11-28T12:00:00.012332+00:00","Kumpula")
    assert 1==1
def test_seconds():
    weathertask.fetch("2020-11-28T11:30:00+00:00","2020-11-28T12:00:00+00:00","Kumpula")
    assert 1==1
def test_z():
    weathertask.fetch("2020-11-28T11:30:00Z","2020-11-28T12:00:00Z","Kumpula")
    assert 1==1